import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { Octree } from './Octree';
import { Capsule } from './Capsule';
import Stats from './Stats';
import { AnimatePresence, motion } from "framer-motion"
import { pageAnimation, API_DOMAIN } from '../../variables'
import Button from '../Button/Button'
import RobotoRegular from './assets/fonts/Roboto_Regular.json'
import RobotoBold from './assets/fonts/Roboto_Bold.json'
import * as dat from 'dat.gui'
import './styles.css'


const wc = 75 //walls coord

const wallPositions = [
    [[[1, 40, 110], [wc, 10, 0]], [[1.5, 1.5, 110.5], [wc, 0.25, 0]]], // first array = wall position; second array = bottom plank position;
    [[[1, 40, 110], [-wc, 10, 0]], [[1.5, 1.5, 110.5], [-wc, 0.25, 0]]],
    [[[110, 40, 1], [0, 10, wc]], [[110.5, 1.5, 1.5], [0, 0.25, wc]]],
    [[[110, 40, 1], [0, 10, -wc]], [[110.5, 1.5, 1.5], [0, 0.25, -wc]]]
]

const lightPos = [
    [[-37, 25, -wc+5], [-37, 10, -wc+1]],
    [[0, 25, -wc+5], [0, 10, -wc+1]],
    [[37, 25, -wc+5], [37, 10, -wc+1]],
    [[wc-5, 25, -37], [wc-1, 10, -37]],
    [[wc-5, 25, 0], [wc-1, 10, 0]],
    [[wc-5, 25, 37], [wc-1, 10, 37]],
    [[37, 25, wc-5], [37, 10, wc-1]],
    [[0, 25, wc-5], [0, 10, wc-1]],
    [[-37, 25, wc-5], [-37, 10, wc-1]],
    [[-wc+5, 25, 37], [-wc+1, 10, 37]],
    [[-wc+5, 25, 0], [-wc+1, 10, 0]],
    [[-wc+5, 25, -37], [-wc+1, 10, -37]],

    // Three D 
    [[60, 25, 60], [60, 0, 60]],
    [[-60, 25, -60], [-60, 0, -60]],
    [[60, 25, -60], [60, 0, -60]],
    [[-60, 25, 60], [-60, 0, 60]],
    [[0, 25, 0], [0, 0, 0]]
]

const artPositions = [
    [-37, 10, -wc+.5, 2, 1], [0, 10, -wc+.5, 2, 1],  [37, 10, -wc+.5, 2, 1], // stena 1
    [wc-.5, 10, -37, 1, 2], [wc-.5, 10, 0, 1, 2],  [wc-.5, 10, 37, 1, 2], // stena 2
    [37, 10, wc-.5, 2, 3], [0, 10, wc-.5, 2, 3], [-37, 10, wc-.5, 2, 3],   // stena 3
    [-wc+.5, 10, 37, 1, 4], [-wc+.5, 10, 0, 1, 4], [-wc+.5, 10, -37, 1, 4], // stena 4
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
  
    
        window.addEventListener('resize', this.onWindowResize);
       
        // const gui = new dat.GUI()
        const all3DObj = new THREE.Group();
        const fontLoader = new FontLoader();
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        const clock = new THREE.Clock();
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( '#000000' );
        // scene.fog = new THREE.Fog( '#000000', 10, 200 ); 

        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        // const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
 
        camera.rotation.order = 'YXZ';

        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true; 
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        const glassMaterial = new THREE.MeshNormalMaterial()
        const wallsMaterial = new THREE.MeshPhongMaterial( { 
            color: '#363636',
            specular: 0x050505,
            shininess: 100
        } )

        
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
        this.all3DObj = all3DObj
        // this.gui = gui
        this.wallsMaterial = wallsMaterial
        this.glassMaterial = glassMaterial

        this.fontLoader = fontLoader
        this.robotoRegular = fontLoader.parse(RobotoRegular)
        this.RobotoBold = fontLoader.parse(RobotoBold)


        this.genMainLights()
        this.genWalls(4)
        this.genFloor()
        this.genArtobjects()
        this.scene.add(this.all3DObj)
        // DEV
        // this.stats = new Stats();
        // this.stats.domElement.style.position = 'absolute';
        // this.stats.domElement.style.top = '0px';
        // this.mount.appendChild(this.stats.domElement);
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

    genLight3D = (pos, size) => {
        const { x, y, z } = pos
        let spotLight =  new THREE.SpotLight('#ffffff', 1, 30, Math.PI * 0.1, 0.25, 1)
        const spotLightHelper = new THREE.SpotLightHelper(spotLight)
        // this.scene.add(spotLightHelper)
        spotLight.position.set(x, y + size.y + 10, z)
        spotLight.target.position.set(x, y, z);

        // let spotLight2 =  new THREE.SpotLight('#ffffff', 1, 30, Math.PI * 0.1, 0.25, 1)
        // spotLight2.position.set(x, y - size.y -3, z)
        // spotLight2.target.position.set(x, y, z);

        this.scene.add(spotLight)

    }

    genLight = (pos, targetPos, boundingBox, artPos) => {
        let spotLight = new THREE.SpotLight( 0xffffff, 0.6 );
        // spotLight.lookAt(targetPos)
       


        spotLight.position.set(pos[0], boundingBox.max.y + 20, pos[2]);
        spotLight.target.position.set(targetPos[0], boundingBox.max.y + 2, targetPos[2]);
        spotLight.angle = Math.PI / 4;
        spotLight.distance = 200;
        spotLight.penumbra = 1
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
    
        // spotLight.shadow.radius = .5;
//         spotLight.shadow.camera.near = 1
//         spotLight.shadow.camera.far = 6
//         spotLight.shadow.camera.top = 100
// spotLight.shadow.camera.right = 100
// spotLight.shadow.camera.bottom = -100
// spotLight.shadow.camera.left = -100
        this.scene.add( spotLight );
        this.scene.add( spotLight.target );
    }

    genArtobject = (artobject, positions) => {
        const imgUrl = artobject.upload;
        const fileType = imgUrl.split('.').pop();
        const artobjectID = artobject.id
        const { category, name } = artobject;
        let { width, height, length, artist } = JSON.parse(artobject.options);
        if (height > 200) height = 200
        if (width > 250) width = 250
        const artPosition = positions.indexOf(artobjectID) 
        // this.genLight(lightPos[artPosition][0], lightPos[artPosition][1])

        
        const texture = new THREE.TextureLoader().load(imgUrl)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set( 1, 1 );
        let incr = 0.1;
        const artobjectPosY = 10 + (height / 100);

        // ============== 3D ==============
        if (category === 2 && artPosition > 0) {
            let incr = 1.5;
            const loader = fileType === 'obj' ? new OBJLoader() : new GLTFLoader();
            loader.load(imgUrl, gltf => {
                let obj = fileType === 'obj' ? gltf : gltf.scene
                // obj.scale.set(0.1, 0.1, 0.1)
                var bbox = new THREE.Box3().setFromObject(obj);
                var size = bbox.getSize(new THREE.Vector3());
                var maxAxis = Math.max(size.x, size.y, size.z);
                console.log({size})
                obj.scale.multiplyScalar(15.0 / maxAxis);
                obj.castShadow = true;
                obj.receiveShadow = true;
                console.log(obj.position.multiplyScalar(15.0 / size.y))
                obj.position.x = threeDPos[artPosition - 12][0];
                obj.position.y = threeDPos[artPosition - 12][1] + 7;
                obj.position.z = threeDPos[artPosition - 12][2];

                  obj.traverse((o) => {
                    if (o.isMesh) o.material =  this.glassMaterial
                    });
                    this.all3DObj.add(obj)
                // this.scene.add( obj );
                this.genLight3D(obj.position, size)

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
            cube.position.y = artobjectPosY
            cube.position.z = artPositions[artPosition][2];
            cube.castShadow = true;

            this.scene.add(cube)

            let geometryRamka = new THREE.BoxGeometry(0.6, height * incr + 0.3, width * incr + 0.3)
            let materialRamka = new THREE.MeshPhongMaterial( { color: '#2b2b2b', specular: 0xffffff, shininess: 10  } );
            let ramka = new THREE.Mesh(geometryRamka, materialRamka)
            ramka.position.x = artPositions[artPosition][0];
            ramka.position.y = artobjectPosY
            ramka.position.z = artPositions[artPosition][2];
            this.scene.add(ramka)
            cube.geometry.computeBoundingBox()
            this.genArtobjectInfo(cube.geometry.boundingBox.getSize(new THREE.Vector3()), artPositions[artPosition], artobjectPosY, name, artist)

            this.genLight(lightPos[artPosition][0], lightPos[artPosition][1], cube.geometry.boundingBox)
        
        } else if (artPosition >= 0){
            let geometry = new THREE.BoxGeometry(width * incr, height * incr, 0.7)
            let material = new THREE.MeshBasicMaterial({color: '#fff', map:texture})

            let cube = new THREE.Mesh(geometry, material)
            cube.position.x = artPositions[artPosition][0];
            cube.position.y = artobjectPosY
            cube.position.z = artPositions[artPosition][2];

            this.scene.add(cube);

            let geometryRamka = new THREE.BoxGeometry(width * incr + 0.3, height * incr + 0.3, 0.6)
            let materialRamka = new THREE.MeshPhongMaterial( { color: '#2b2b2b', specular: 0xffffff, shininess: 10} );
            let ramka = new THREE.Mesh(geometryRamka, materialRamka)
            ramka.position.x = artPositions[artPosition][0];
            ramka.position.y = artobjectPosY
            ramka.position.z = artPositions[artPosition][2];
            ramka.castShadow = true;
            this.scene.add(ramka)
            this.worldOctree.fromGraphNode(cube);

            // const cubeCollider = new Capsule( 
            //     new THREE.Vector3( artPositions[artPosition][0] - 5, 0, artPositions[artPosition][2] - 5 ),
            //     new THREE.Vector3( artPositions[artPosition][0] + 5, 13, artPositions[artPosition][2] + 5 ), 
            //     5 );

            // console.log(cubeCollider)
            // setTimeout(() => console.log(this.playerCollider, cubeCollider), 5000)
            cube.geometry.computeBoundingBox()

            // setTimeout(() => console.log(this.playerCollider.intersectsBox(cube.geometry.boundingBox)), 5000)
            // setTimeout(() => console.log(this.worldOctree.calcBox()), 3000)

            this.genLight(lightPos[artPosition][0], lightPos[artPosition][1], cube.geometry.boundingBox, artPosition)
            
            this.genArtobjectInfo(cube.geometry.boundingBox.getSize(new THREE.Vector3()), artPositions[artPosition], artobjectPosY, name, artist)

        }
        
    }

    

    genArtobjectInfo = (box, artPosition, artPositionY, name, artist) => {
        const geometry = new TextGeometry(`«${name}»${artist ? `\nby ${artist}` : ''}`, {
            font: this.RobotoBold,
            size: .2,
            height: 0.001,
            curveSegments: 12,
           
        } );
        const material = new THREE.MeshBasicMaterial({color: "#ffffff"})

        const textMesh = new THREE.Mesh(geometry, material)
        let textPosY = artPositionY  - box.y / 2 + .5;
        console.log(textPosY,'fdfsdfdsfdskjfnsdkjfdnsjhkn')
        if (textPosY < 6) textPosY = 6
        switch (artPosition[4]){
            case 1:
                textMesh.position.set(artPosition[0] + box.x / 2 + .5 , textPosY, artPosition[2] + .1)

                break;
            case 2:
                textMesh.position.set(artPosition[0] - .1, textPosY, artPosition[2] + box.z / 2 + .4)
                textMesh.rotateY(-Math.PI / 2)

                break;
            case 3:
                textMesh.position.set(artPosition[0] - box.x / 2 - .5 , textPosY, artPosition[2] - .2)
                textMesh.rotateY(Math.PI)
                break;
            case 4:
                console.log(box)
                textMesh.position.set(artPosition[0] + .1, textPosY, artPosition[2] + -box.z / 2 - .4)

                textMesh.rotateY(Math.PI / 2)

                break;
            default:
                break;

        }
        // textMesh.position.set(artPosition[0] + box.x / 2 + .5 , textPosY, artPosition[2] + .1)
        this.scene.add(textMesh)
            
        
    }
    // SHIT ZONE ENDED

    genMainLights = () => {
        const ambientlight = new THREE.AmbientLight( '#363636', .3 );
        // this.scene.add( ambientlight );

        // const wallLight1 = new THREE.DirectionalLight( 0xfffffff, 0.4 );
        // wallLight1.position.set( 10, 1, 2 );
        // this.scene.add( wallLight1 );

        // const wallLight2 = new THREE.DirectionalLight( 0xfffffff, 0.4 );
        // wallLight2.position.set( -10, 1, -2 );
        // this.scene.add( wallLight2 );

        // const wallLight3 = new THREE.DirectionalLight( 0xfffffff, 0.4 );
        // wallLight3.position.set( -2, 1, 10 );
        // this.scene.add( wallLight3 );

        // const wallLight4 = new THREE.DirectionalLight( 0xfffffff, 0.4 );
        // wallLight4.position.set( 2, 1, -10 );
        // this.scene.add( wallLight4 );

        // const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
        // directionalLight.position.set( 0, 5, 0 );
        // directionalLight.castShadow = true;
        // directionalLight.shadow.camera.near = 0.01;
        // directionalLight.shadow.camera.far = 500;
        // directionalLight.shadow.camera.right = 30;
        // directionalLight.shadow.camera.left =  30;
        // directionalLight.shadow.camera.top	= 30;
        // directionalLight.shadow.camera.bottom = 30;
        // directionalLight.shadow.mapSize.width = 1024;
        // directionalLight.shadow.mapSize.height = 1024;
        // directionalLight.shadow.radius = 4;
        // directionalLight.shadow.bias = 0.06;
        // this.scene.add( directionalLight );

        // const light = new THREE.HemisphereLight( 0xeeeeff, 0x696969, 1 );
        // light.position.set( 0, 1, 0 );
        // this.scene.add( light );

    }

    genWalls = num => {
        for(let i = 0; i < num; i++) {
            let geometry = new THREE.BoxGeometry(...wallPositions[i][0][0], 10,10);
           
  
    
              
        
            let mesh = new THREE.Mesh( geometry, this.wallsMaterial );
     
            mesh.matrixAutoUpdate = false
            mesh.position.set(...wallPositions[i][0][1]);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
			this.worldOctree.fromGraphNode( mesh );

            let plankGeometry = new THREE.BoxGeometry(...wallPositions[i][1][0]);
          
            let plankMesh = new THREE.Mesh( plankGeometry, this.wallsMaterial );
            plankMesh.position.set(...wallPositions[i][1][1]);
            plankMesh.castShadow = true;
            plankMesh.receiveShadow = true;
            this.scene.add(plankMesh);
        }
    }

    genFloor = () => {
        let groundGeo = new THREE.PlaneBufferGeometry( 200, 200 );
      
       

        
        let ground = new THREE.Mesh( groundGeo, this.wallsMaterial );
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
        document.addEventListener('fullscreenchange', this.onWindowResize)

        document.addEventListener('keydown', this.changeKeyStatesTrue);
        document.addEventListener('keyup', this.changeKeyStatesFalse);
        document.addEventListener('mousedown', this.requestPointerLock);
        document.body.addEventListener('mousemove', this.mouseMoveListener);
        document.addEventListener('pointerlockchange', this.pointerLockChanged);
    }

    removeListeners = () => {
        document.removeEventListener('keydown', this.changeKeyStatesTrue);
        document.removeEventListener('keyup', this.changeKeyStatesFalse);
        document.removeEventListener('mousedown', this.requestPointerLock);
        document.body.removeEventListener('mousemove', this.mouseMoveListener);
        document.removeEventListener('fullscreenchange', this.onWindowResize)

    }

    onWindowResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
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

    componentWillUnmount() {
        this.stop()
        this.scene.remove.apply(this.scene, this.scene.children);
        // this.mount.removeChild(this.renderer.domElement)
        window.onpopstate = () => null
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        setTimeout(this.onWindowResize, 500)
        this.removeListeners()
        document.exitPointerLock()
        document.title = "Orby"
        window.removeEventListener('resize', this.onWindowResize);

        cancelAnimationFrame(this.frameId)
    }

    animate = () => {
        const deltaTime = Math.min( 0.1, this.clock.getDelta() );
        
        this.controls(deltaTime);
        this.updatePlayer( deltaTime );
      
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)

        // DEV
        // this.stats.update();
        // 
        
        if(this.all3DObj.children) {
            this.all3DObj.children.forEach(el => {
                el.rotation.y += .001
            })
           
        }
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

    enterSpace =  () => {
        document.documentElement.requestFullscreen().then(() => {
            this.setState({showMenu: false}, () => {
                this.addListeners()
                this.requestPointerLock()
                this.onWindowResize()
            })
        })
    }

    pauseSpace = () => {
        this.setState({showMenu: true}, () => this.removeListeners())
    }

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