import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
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

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        const clock = new THREE.Clock();
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xD9D9D9 );
        scene.fog = new THREE.Fog( 0xD9D9D9, 10, 200 );

        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.rotation.order = 'YXZ';

        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true; 
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
        this.clock = clock
        this.scene = scene
        this.camera = camera
        this.renderer = renderer

        this.genMainLights()
        this.genWalls(4)
        this.genFloor()
        this.genArtobjects()

        // DEV
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.mount.appendChild(this.stats.domElement);
        // 

        if(this.props.preview) {
            window.onpopstate = () => this.props.closePreview()
        }

        this.mount.appendChild(this.renderer.domElement)
        this.start()
    }

    // REFACTOR THIS SHIT
    genArtobjects = () => {
        const { space, preview } = this.props;
        if(preview){
            const tempSpace = JSON.parse(JSON.stringify(space));
            if(!tempSpace.avatar) {
                tempSpace.avatar = 'https://api.orby.space/media/avatars/spacedefault.png'
            }
            if(!tempSpace.name) {
                tempSpace.name = 'Untitled gallery'
            }
            if(!tempSpace.description) {
                tempSpace.description = 'Here will be your gallery description'
            }
            this.setState({space: tempSpace})
            document.title = `${space.name} gallery`;
            space.artobjects.map(artobject => this.genArtobject(artobject, space.positions))
        } else {
            fetch(`${API_DOMAIN}/spaces/${this.props.match.params.spaceid}/`)
            .then(response => response.json())
              .then(data => {
                  const { name, artobjects, options } = data;
                  this.setState({space: data})
                  const { positions } = JSON.parse(options);
                  document.title = `${name} gallery`;
                
                  artobjects.map(artobject => this.genArtobject(artobject, positions))
            })
        }
       
    }

    genLight = (pos, targetPos) => {
        var spotLight = new THREE.SpotLight( 0xffffff, 0.2 );

        spotLight.position.set(pos[0], pos[1], pos[2]);
        spotLight.target.position.set(targetPos[0], targetPos[1], targetPos[2]);
        spotLight.angle = Math.PI / 3;
        spotLight.penumbra = 0.5;
        spotLight.decay = 2;
        spotLight.distance = 200;
        spotLight.shadow.mapSize.width = 12;
        spotLight.shadow.mapSize.height = 12;
        spotLight.shadow.camera.near = 60;
        spotLight.shadow.camera.far = 200;
        this.scene.add( spotLight );
        this.scene.add( spotLight.target );
    }

    genArtobject = (artobject, positions) => {
        const imgUrl = artobject.upload;
        const fileType = imgUrl.split('.').pop();
        const artobjectID = artobject.id
        const { category } = artobject;
        let { width, height, length } = JSON.parse(artobject.options);
        if (height > 200) height = 200
        if (width > 250) width = 250
        const artPosition = positions.indexOf(artobjectID) 
        this.genLight(lightPos[artPosition][0], lightPos[artPosition][1])

        
        const texture = new THREE.TextureLoader().load(imgUrl)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set( 1, 1 );
        let incr = 0.1;
        // ============== 3D ==============
        if (category === 2 && artPosition > 0) {
            let incr = 7;
            const loader = fileType === 'obj' ? new OBJLoader() : new GLTFLoader();
            loader.load(imgUrl, gltf => {
                let obj = fileType === 'obj' ? gltf : gltf.scene

                var bbox = new THREE.Box3().setFromObject(obj);
                var size = bbox.getSize(new THREE.Vector3());
                var maxAxis = Math.max(size.x, size.y, size.z);
                obj.scale.multiplyScalar(15.0 / maxAxis);
                obj.castShadow = true;
                obj.receiveShadow = true;
                console.log(size)
                obj.position.x = threeDPos[artPosition - 12][0];
                obj.position.y = threeDPos[artPosition - 12][1] + 7;
                obj.position.z = threeDPos[artPosition - 12][2];

                this.scene.add( obj );

            }, undefined, function ( error ) {
                console.error( error );

            } );
        // ============== PAingsitsins} ==============
        } else if (artPosition >= 0 && artPositions[artPosition][3] === 1) {
            let geometry = new THREE.BoxGeometry(0.7, height * incr, width * incr)
            let material = new THREE.MeshBasicMaterial({color: '#fff', map:texture })

            let cube = new THREE.Mesh(geometry, material)
            // if(height >= 100) {

            // }
            cube.position.x = artPositions[artPosition][0];
            cube.position.y = 10 + (height / 100);
            cube.position.z = artPositions[artPosition][2];
            cube.castShadow = true;

            this.scene.add(cube)

            let geometryRamka = new THREE.BoxGeometry(0.69, height * incr + 0.2, width * incr + 0.2)
            let materialRamka = new THREE.MeshPhongMaterial( { color: '#2b2b2b', specular: 0xffffff, shininess: 10  } );
            let ramka = new THREE.Mesh(geometryRamka, materialRamka)
            ramka.position.x = artPositions[artPosition][0];
            ramka.position.y = 10 + (height / 100);
            ramka.position.z = artPositions[artPosition][2];
            ramka.castShadow = true;
            this.scene.add(ramka)
        
        } else if (artPosition >= 0){
            let geometry = new THREE.BoxGeometry(width * incr, height * incr, 0.7)
            let material = new THREE.MeshBasicMaterial({color: '#fff', map:texture})

            let cube = new THREE.Mesh(geometry, material)
            cube.position.x = artPositions[artPosition][0];
            cube.position.y = 10 + (height / 100);
            cube.position.z = artPositions[artPosition][2];
            cube.castShadow = true;

            this.scene.add(cube)

            let geometryRamka = new THREE.BoxGeometry(width * incr + 0.2, height * incr + 0.2, 0.69)
            let materialRamka = new THREE.MeshPhongMaterial( { color: '#2b2b2b', specular: 0xffffff, shininess: 10} );
            let ramka = new THREE.Mesh(geometryRamka, materialRamka)
            ramka.position.x = artPositions[artPosition][0];
            ramka.position.y = 10 + (height / 100);
            ramka.position.z = artPositions[artPosition][2];
            ramka.castShadow = true;
            this.scene.add(ramka)
        }
    }
    // SHIT ZONE ENDED

    genMainLights = () => {
        const ambientlight = new THREE.AmbientLight( 0xffffff, 0.3 );
        this.scene.add( ambientlight );

        const wallLight1 = new THREE.DirectionalLight( 0xfffffff, 0.4 );
        wallLight1.position.set( 10, 1, 2 );
        this.scene.add( wallLight1 );

        const wallLight2 = new THREE.DirectionalLight( 0xfffffff, 0.4 );
        wallLight2.position.set( -10, 1, -2 );
        this.scene.add( wallLight2 );

        const wallLight3 = new THREE.DirectionalLight( 0xfffffff, 0.4 );
        wallLight3.position.set( -2, 1, 10 );
        this.scene.add( wallLight3 );

        const wallLight4 = new THREE.DirectionalLight( 0xfffffff, 0.4 );
        wallLight4.position.set( 2, 1, -10 );
        this.scene.add( wallLight4 );

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
        directionalLight.position.set( 0, 5, 0 );
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.01;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.right = 30;
        directionalLight.shadow.camera.left =  30;
        directionalLight.shadow.camera.top	= 30;
        directionalLight.shadow.camera.bottom = 30;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.radius = 4;
        directionalLight.shadow.bias = 0.06;
        this.scene.add( directionalLight );

        // const light = new THREE.HemisphereLight( 0xeeeeff, 0x696969, 1 );
        // light.position.set( 0, 1, 0 );
        // this.scene.add( light );

    }

    genWalls = num => {
        for(let i = 0; i < num; i++) {
            let geometry = new THREE.BoxGeometry(...wallPositions[i][0][0]);
            let material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 0} );
            let mesh = new THREE.Mesh( geometry, material );
            mesh.matrixAutoUpdate = false
            mesh.position.set(...wallPositions[i][0][1]);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
			this.worldOctree.fromGraphNode( mesh );

            let plankGeometry = new THREE.BoxGeometry(...wallPositions[i][1][0]);
            let plankMaterial = new THREE.MeshPhongMaterial( { color: 0xa6a6a6, specular: 0xffffff, shininess: 1 } );
            let plankMesh = new THREE.Mesh( plankGeometry, plankMaterial );
            plankMesh.position.set(...wallPositions[i][1][1]);
            plankMesh.castShadow = true;
            plankMesh.receiveShadow = true;
            this.scene.add(plankMesh);
        }
    }

    genFloor = () => {
        let groundGeo = new THREE.PlaneBufferGeometry( 1000, 1000 );
        let groundMat = new THREE.MeshStandardMaterial( { 
         color: 0xffffff, specular: 0xffffff, shininess: 30

        } );
        let ground = new THREE.Mesh( groundGeo, groundMat );
        ground.rotation.x = -Math.PI/2;
        ground.position.y = 0;
        ground.receiveShadow = true;
        this.scene.add(ground);
		this.worldOctree.fromGraphNode(ground);
    }

    changeKeyStatesTrue = e => this.keyStates[e.code] = true;
    changeKeyStatesFalse = e => this.keyStates[e.code] = false;
    requestPointerLock = e => document.body.requestPointerLock()

    mouseMoveListener = e => {
        if (document.pointerLockElement === document.body) {
            this.camera.rotation.y -= e.movementX / 500;
            this.camera.rotation.x -= e.movementY / 500;
        }
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
    
    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
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
        const speed = 50;
        if (this.playerOnFloor) {
            (this.keyStates['KeyW'] || this.keyStates['ArrowUp']) && this.playerVelocity.add(this.getForwardVector().multiplyScalar(speed * deltaTime));
            (this.keyStates['KeyS'] || this.keyStates['ArrowDown']) && this.playerVelocity.add(this.getForwardVector().multiplyScalar(-speed * deltaTime));
            (this.keyStates['KeyA'] || this.keyStates['ArrowLeft']) && this.playerVelocity.add(this.getSideVector().multiplyScalar(-speed * deltaTime));
            (this.keyStates['KeyD'] || this.keyStates['ArrowRight']) && this.playerVelocity.add(this.getSideVector().multiplyScalar(speed * deltaTime));

            if (this.keyStates['Space']) this.playerVelocity.y = 25;
            // this.keyStates['Escape'] && this.pauseSpace()
        }
    }

    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
        window.onpopstate = () => null
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        this.removeListeners()
        document.exitPointerLock()
        document.title = "Orby"
        cancelAnimationFrame(this.frameId)
    }

    animate = () => {
        const deltaTime = Math.min( 0.1, this.clock.getDelta() );
        
        this.controls(deltaTime);
        this.updatePlayer( deltaTime );
      
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)

        // DEV
        this.stats.update();
        // 
        
        this.now = Date.now();
        this.delta = this.now - this.then;
        if (this.delta > this.interval) {
            this.then = this.now - (this.delta % this.interval);
        }
    }

    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
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
                                                <div className={'space-view-menu-icon-text'}>Use AWSD or arrow keys on your keyboard to move around</div>
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