import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { Octree } from './Octree';
import { Capsule } from './Capsule';
import Stats from './Stats';
import { AnimatePresence, motion } from "framer-motion"
import { pageAnimation, API_DOMAIN } from '../../variables'
import Button from '../Button/Button'
import './styles.css'


const wallPositions = [
    [[[1, 30, 90], [60, 10, 0]], [[1.5, 1.5, 90.5], [60, 0.75, 0]]], // first array = wall position; second array = bottom plank position;
    [[[1, 30, 90], [-60, 10, 0]], [[1.5, 1.5, 90.5], [-60, 0.75, 0]]],
    [[[90, 30, 1], [0, 10, 60]], [[90.5, 1.5, 1.5], [0, 0.75, 60]]],
    [[[90, 30, 1], [0, 10, -60]], [[90.5, 1.5, 1.5], [0, 0.75, -60]]]
]

const lightPos = [
    [[-26, 25, -55], [-26, 10, -59]],
    [[0, 25, -55], [0, 10, -59]],
    [[26, 25, -55], [26, 10, -59]],
    [[55, 25, -26], [59, 10, -26]],
    [[55, 25, 0], [59, 10, 0]],
    [[55, 25, 26], [59, 10, 26]],
    [[26, 25, 55], [26, 10, 59]],
    [[0, 25, 55], [0, 10, 59]],
    [[-26, 25, 55], [-26, 10, 59]],
    [[-55, 25, 26], [-59, 10, 26]],
    [[-55, 25, 0], [-59, 10, 0]],
    [[-55, 25, -26], [-59, 10, -26]],

    // Three D 
    [[60, 25, 60], [60, 0, 60]],
    [[-60, 25, -60], [-60, 0, -60]],
    [[60, 25, -60], [60, 0, -60]],
    [[-60, 25, 60], [-60, 0, 60]],
    [[0, 25, 0], [0, 0, 0]]
]

const artPositions = [
    [-26, 10, -59.5, 2], [0, 10, -59.5, 2],  [26, 10, -59.5, 2], // stena 1
    [59.5, 10, -26, 1], [59.5, 10, 0, 1],  [59.5, 10, 26, 1], // stena 2
    [26, 10, 59.5, 2], [0, 10, 59.5, 2], [-26, 10, 59.5, 2],   // stena 3
    [-59.5, 10, 26, 1], [-59.5, 10, 0, 1], [-59.5, 10, -26, 1], // stena 4
]

const threeDPos = [
    [60, 2, 60], [-60, 2, -60], [60, 2, -60], [-60, 2, 60], [0, 2, 0]
]



class Scene extends Component {
    state = {
        showMenu: true,
        space: {}
    }

    constructor(props) {
        super(props)

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
    }

    componentDidMount() {
        this.GRAVITY = 28;
        this.worldOctree = new Octree();
        this.playerCollider = new Capsule( new THREE.Vector3( 0, 3.5, 0 ), new THREE.Vector3( 0, 10, 0 ), 3.5 );
        this.playerVelocity = new THREE.Vector3();
        this.playerDirection = new THREE.Vector3();
        this.playerOnFloor = false;
        this.keyStates = {};
        this.now = Date.now();
        this.delta = Date.now();
        this.then = Date.now();
        this.interval = 1000/30;

        const width = this.mount.clientWidth
        const height = this.mount.clientHeight

        const clock = new THREE.Clock();
        const scene = new THREE.Scene()
        scene.background = new THREE.Color( 0xD9D9D9 );
        // scene.fog = new THREE.Fog( 0xD9D9D9, 10, 200 ); 

        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.z = 10;
        camera.position.y = 1;
        camera.rotation.order = 'YXZ';

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


        const pointLight = new THREE.PointLight('#000000');
        pointLight.position.set(5, 5, 5);

        const ambientLight = new THREE.AmbientLight('#ffffff', 1);
        scene.add(pointLight, ambientLight);
        const lightHelper = new THREE.PointLightHelper(pointLight)
        const gridHelper = new THREE.GridHelper(1000, 1000);
        // scene.add(lightHelper, gridHelper)


        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.clock = clock

        this.genFloor()

        this.mount.appendChild(this.renderer.domElement)
        this.start()
    }

    genFloor = () => {
        let material = new THREE.MeshStandardMaterial({color: 0xffffff, specular: 0xffffff, shininess: 30})
        let geometry = new THREE.PlaneBufferGeometry(1000, 1000, 1, 1)
        let ground = new THREE.Mesh(geometry, material)
        ground.receiveShadow = true;
        ground.rotation.x = -Math.PI/2;
        ground.position.y = 0;

        this.scene.add(ground)
		this.worldOctree.fromGraphNode(ground);
    }

        
    closeSpace = () => {
        if(this.props.preview) {
            this.props.closePreview()
        } else {
            this.props.history.goBack.length ? this.props.history.goBack() :  this.props.history.push('/')
        }
    };

    enterSpace = () => {
        this.setState({showMenu: false}, () => {
            this.addListeners()
            this.requestPointerLock()
        })
    }

    pauseSpace = () => this.setState({showMenu: true}, () => this.removeListeners())
    pointerLockChanged = () => !document.pointerLockElement && this.pauseSpace()

    changeKeyStatesTrue = e => this.keyStates[e.code] = true;
    changeKeyStatesFalse = e => this.keyStates[e.code] = false;
    requestPointerLock = () => document.body.requestPointerLock()

    mouseMoveListener = e => {
        if (document.pointerLockElement === document.body) {
            this.camera.rotation.y -= e.movementX / 500;
            this.camera.rotation.x -= e.movementY / 500;
        }
    }

    playerCollitions = () => {
        const result = this.worldOctree.capsuleIntersect(this.playerCollider);
        this.playerOnFloor = false;

        if (result) {
            this.playerOnFloor = result.normal.y > 0;
            if (!this.playerOnFloor) {
                this.playerVelocity.addScaledVector(result.normal, - result.normal.dot(this.playerVelocity));
            }
            this.playerCollider.translate(result.normal.multiplyScalar(result.depth));
        }
    }

    updatePlayer = deltaTime => {
        if (this.playerOnFloor) {
            const damping = Math.exp(-3 * deltaTime) - 1;
            this.playerVelocity.addScaledVector(this.playerVelocity, damping);
        } else {
            this.playerVelocity.y -= this.GRAVITY * deltaTime;
        }

        const deltaPosition = this.playerVelocity.clone().multiplyScalar(deltaTime);
        this.playerCollider.translate(deltaPosition);

        this.playerCollitions();
        this.camera.position.copy(this.playerCollider.end);
    }

    getForwardVector = () => {
        this.camera.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();

        return this.playerDirection;

    }

    getSideVector = () => {
        this.camera.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();
        this.playerDirection.cross(this.camera.up);

        return this.playerDirection;
    } 
    
    controls = deltaTime => {
        const speed = 75;
        if (this.playerOnFloor) {
            (this.keyStates['KeyW'] || this.keyStates['ArrowUp']) && this.playerVelocity.add(this.getForwardVector().multiplyScalar(speed * deltaTime));
            (this.keyStates['KeyS'] || this.keyStates['ArrowDown']) && this.playerVelocity.add(this.getForwardVector().multiplyScalar(-speed * deltaTime));
            (this.keyStates['KeyA'] || this.keyStates['ArrowLeft']) && this.playerVelocity.add(this.getSideVector().multiplyScalar(-speed * deltaTime));
            (this.keyStates['KeyD'] || this.keyStates['ArrowRight']) && this.playerVelocity.add(this.getSideVector().multiplyScalar(speed * deltaTime));

            if (this.keyStates['Space']) this.playerVelocity.y = 15;
            // this.keyStates['Escape'] && this.pauseSpace()
        }
    }

    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    }


    addListeners = () => {
        document.addEventListener('keydown', this.changeKeyStatesTrue);
        document.addEventListener('keyup', this.changeKeyStatesFalse);
        document.addEventListener('mousedown', this.requestPointerLock);
        document.body.addEventListener('mousemove', this.mouseMoveListener);
        window.addEventListener('resize', this.onWindowResize);
        document.addEventListener('pointerlockchange', this.pointerLockChanged);
    }

    removeListeners = () => {
        document.removeEventListener('keydown', this.changeKeyStatesTrue);
        document.removeEventListener('keyup', this.changeKeyStatesFalse);
        document.removeEventListener('mousedown', this.requestPointerLock);
        document.body.removeEventListener('mousemove', this.mouseMoveListener);
        window.removeEventListener('resize', this.onWindowResize);
    }
    

    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop() {
        this.removeListeners()
        document.exitPointerLock()
        document.title = "Orby"
        cancelAnimationFrame(this.frameId)
    }

    animate() {
        const deltaTime = Math.min( 0.1, this.clock.getDelta() );
        
        this.controls(deltaTime);
        this.updatePlayer( deltaTime );
      
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera)
    }


    render() {
        const { showMenu, space } = this.state;
        return (
            <motion.div {...pageAnimation}>
                <div className={`space-view-cont ${!showMenu ? 'space-view-cont-active' : ''}`} ref={(mount) => { this.mount = mount }} />
                <AnimatePresence exitBeforeEnter>
                    {
                        showMenu ?
                            <motion.div {...pageAnimation} className={'space-view-menu'}>
                                <div className={'space-view-menu-cont'}>
                                    <div className={'space-view-menu-back'} onClick={this.closeSpace}>Exit 3D gallery</div>
                                    <div className={'space-view-menu-body'}>
                                        <div className={'space-view-menu-avatar'} style={{backgroundImage: `url('${space.avatar}')`}}/>
                                        <div className={'space-view-menu-title'}>{space.name}</div>
                                        <div className={'space-view-menu-description'}>{space.description}</div>
                                        <div className={'space-view-menu-icons'}>
                                            <div className={'space-view-menu-icon-cont'}>
                                                <div className={'space-view-menu-icon-mouse'}/>
                                                <div className={'space-view-menu-icon-text'}>Move your mouse to look around</div>
                                            </div>
                                            <div className={'space-view-menu-icon-cont'}>
                                                <div className={'space-view-menu-icon-keys'}/>
                                                <div className={'space-view-menu-icon-text'}>Use WASD or arrow keys on your keyboard to move around</div>
                                            </div>
                                            <div className={'space-view-menu-icon-cont'}>
                                                <div className={'space-view-menu-icon-esc'}/>
                                                <div className={'space-view-menu-icon-text'}>Press the ESC key to menu</div>
                                            </div>
                                        </div>
                                        <Button text={'Enter 3D gallery'} onClick={this.enterSpace} />
                                    </div>
                                    <div className={'space-view-menu-share'}></div>
                                </div>
                            </motion.div>
                            :
                            <motion.div {...pageAnimation} className={'space-view-esc'}>
                                <div className="space-view-esc-icon"/>
                                <div className="space-view-esc-text">Press the ESC key to menu</div>
                            </motion.div>
                    }
                </AnimatePresence>
            </motion.div>
           
        )
    }
}

const mapStateToProps = state => ({
    space: state.Space.space,
})

export default connect(mapStateToProps, null)(Scene);