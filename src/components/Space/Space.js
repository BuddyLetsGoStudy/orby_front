import React, { Component } from 'react'
import * as THREE from 'three'
import { Octree } from './Octree';
import { Capsule } from './Capsule';
import Stats from './Stats';
import { AnimatePresence, motion } from "framer-motion"
import { pageAnimation, API_DOMAIN } from '../../variables'
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
]

const artPositions = [
    [-26, 10, -59.5, 2], [0, 10, -59.5, 2],  [26, 10, -59.5, 2], // stena 1
    [59.5, 10, -26, 1], [59.5, 10, 0, 1],  [59.5, 10, 26, 1], // stena 2
    [26, 10, 59.5, 2], [0, 10, 59.5, 2], [-26, 10, 59.5, 2],   // stena 3
    [-59.5, 10, 26, 1],[-59.5, 10, 0, 1], [-59.5, 10, -26, 1], // stena 4
]

class Scene extends Component {
    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        const clock = new THREE.Clock();
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xf0f0f0f0 );

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

        this.addListeners()

        // DEV
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.mount.appendChild(this.stats.domElement);
        // 

        this.mount.appendChild(this.renderer.domElement)
        this.start()
    }

    genArtobjects = () => {
        fetch(`${API_DOMAIN}/spaces/${this.props.match.params.spaceid}/`)
				.then(response => response.json())
  				.then(data => {
					  console.log(data)
					  const { name, artobjects, options } = data;
					  const { positions } = JSON.parse(options);
					  console.log('YEAHHAHHA', name, artobjects, positions)
					  document.title = `${name} gallery`;
					
					  artobjects.map((artobject, i) => {
						//   setTimeout(() => {
							const imgUrl = artobject.upload;
							const fileType = imgUrl.split('.').pop();
							const artobjectID = artobject.id
							console.log(artobject);
							const { category } = artobject;
							const { width, height, length } = JSON.parse(artobject.options);

							const artPosition = positions.indexOf(artobjectID) 
							console.log(artPosition, 'FUCUCUUFVHIFU')
							// category !== 2 && genLight(lightPos[artPosition][0], lightPos[artPosition][1], scene)

							
							const texture = new THREE.TextureLoader().load(imgUrl)
							texture.wrapS = THREE.RepeatWrapping
							texture.wrapT = THREE.RepeatWrapping
							texture.repeat.set( 1, 1 );
							let incr = 0.1;
							if (category === 2 && artPosition > 0) {
								// let incr = 7;
								// const loader = fileType === 'obj' ? new OBJLoader() : new GLTFLoader();
								// loader.load(imgUrl, gltf => {
								// 	let obj = fileType === 'obj' ? gltf : gltf.scene
								// 	console.log(artPosition - 12, 'UFVIIFDVODI')
								// 	obj.position.x = threeDPos[artPosition - 11][0];
								// 	obj.position.y = threeDPos[artPosition - 11][1];
								// 	obj.position.z = threeDPos[artPosition - 11][2];
								// 	console.log('POSITIONS NOW BUDDY FYCK', threeDPos[artPosition - 11][0], threeDPos[artPosition - 11][1], threeDPos[artPosition - 11][2])
								// 	obj.scale.y = height * incr;
								// 	obj.scale.x = width * incr;
								// 	obj.scale.z = length * incr;
								// 	scene.add( obj );

								// }, undefined, function ( error ) {
								// 	console.error( error );

								// } );
                                console.log('fukc')
							} else if (artPosition > 0 && artPositions[artPosition][3] === 1) {
								let geometry = new THREE.BoxGeometry(0.7, height * incr, width * incr)
								let material = new THREE.MeshBasicMaterial({color: '#fff', map:texture })
								// let material = new THREE.MeshBasicMaterial({color: '#fff' })

								let cube = new THREE.Mesh(geometry, material)
								cube.position.x = artPositions[artPosition][0];
								cube.position.y = artPositions[artPosition][1];
								cube.position.z = artPositions[artPosition][2];
								this.scene.add(cube)

								let geometryRamka = new THREE.BoxGeometry(0.69, height * incr + 0.2, width * incr + 0.2)
								let materialRamka = new THREE.MeshPhongMaterial( { color: '#2b2b2b', specular: 0xffffff, shininess: 10  } );
								let ramka = new THREE.Mesh(geometryRamka, materialRamka)
								ramka.position.x = artPositions[artPosition][0];
								ramka.position.y = artPositions[artPosition][1];
								ramka.position.z = artPositions[artPosition][2];
								ramka.castShadow = true;
								this.scene.add(ramka)
							
							} else if (artPosition > 0){
								let geometry = new THREE.BoxGeometry(width * incr, height * incr, 0.7)
								let material = new THREE.MeshBasicMaterial({color: '#fff', map:texture})
								// let material = new THREE.MeshBasicMaterial({color: '#fff' })

								let cube = new THREE.Mesh(geometry, material)
								cube.position.x = artPositions[artPosition][0];
								cube.position.y = artPositions[artPosition][1];
								cube.position.z = artPositions[artPosition][2];
								this.scene.add(cube)

								let geometryRamka = new THREE.BoxGeometry(width * incr + 0.2, height * incr + 0.2, 0.69)
								let materialRamka = new THREE.MeshPhongMaterial( { color: '#2b2b2b', specular: 0xffffff, shininess: 10} );
								let ramka = new THREE.Mesh(geometryRamka, materialRamka)
								ramka.position.x = artPositions[artPosition][0];
								ramka.position.y = artPositions[artPosition][1];
								ramka.position.z = artPositions[artPosition][2];
								ramka.castShadow = true;
								this.scene.add(ramka)
							
							}
						//   }, 3000)
							
							
					})
				})

    }

    genMainLights = () =>{
        const ambientlight = new THREE.AmbientLight( 0xffffff, 0.1 );
        this.scene.add( ambientlight );

        const fillLight1 = new THREE.DirectionalLight( 0xfffffff, 0.5 );
        fillLight1.position.set( - 1, 1, 2 );
        this.scene.add( fillLight1 );

        const fillLight2 = new THREE.DirectionalLight( 0xfffff, 0.2 );
        fillLight2.position.set( 0, - 1, 0 );
        this.scene.add( fillLight2 );

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
        directionalLight.position.set( 0, 100, 0 );
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
            let plankMaterial = new THREE.MeshPhongMaterial( { color: 0x333333, specular: 0xffffff, shininess: 1 } );
            let plankMesh = new THREE.Mesh( plankGeometry, plankMaterial );
            plankMesh.position.set(...wallPositions[i][1][1]);
            plankMesh.castShadow = true;
            plankMesh.receiveShadow = true;
            this.scene.add(plankMesh);
        }
    }

    genFloor = () => {
        let groundGeo = new THREE.PlaneBufferGeometry( 1000, 1000 );
        let groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x00000} );
        let ground = new THREE.Mesh( groundGeo, groundMat );
        ground.rotation.x = -Math.PI/2;
        ground.position.y = 0;
        ground.castShadow = false;
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
            this.keyStates['KeyW'] && this.playerVelocity.add(this.getForwardVector().multiplyScalar(speed * deltaTime));
            this.keyStates['KeyS'] && this.playerVelocity.add(this.getForwardVector().multiplyScalar(-speed * deltaTime));
            this.keyStates['KeyA'] && this.playerVelocity.add(this.getSideVector().multiplyScalar(-speed * deltaTime));
            this.keyStates['KeyD'] && this.playerVelocity.add(this.getSideVector().multiplyScalar(speed * deltaTime));

            if (this.keyStates['Space']) this.playerVelocity.y = 15;
        }
    }

    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        this.removeListeners()
        document.exitPointerLock()
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

    render() {
        return (
            <motion.div
                {...pageAnimation}
                className={'space-view-cont'}
                ref={(mount) => { this.mount = mount }}
            />
        )
    }
}

export default Scene