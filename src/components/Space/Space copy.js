import React, { Component } from 'react'
import * as THREE from 'three'

class Scene extends Component {
    constructor(props) {
        super(props)

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
    }

    componentDidMount() {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight

        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#000000');

        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.z = 10;
        camera.position.y = 1;
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight - 75);


        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: '#433F81' })
        const cube = new THREE.Mesh(geometry, material)
        cube.position.z = 1
        cube.position.y = 1;

        scene.add(cube)


        // const groundGeo = new THREE.PlaneBufferGeometry( 1000, 1000 );
        // const groundMat = new THREE.MeshPhongMaterial( { color: '#ffc9d2', specular: 0x00000} );
        // const ground = new THREE.Mesh( groundGeo, groundMat );
        // ground.rotation.x = -Math.PI/2;
        // ground.position.y = 0;
        // ground.castShadow = false;
        // ground.receiveShadow = true;
        // scene.add( ground );
        const geometryPlane = new THREE.PlaneBufferGeometry( 1000, 1000 );
        const materialPlane = new THREE.MeshBasicMaterial( {color: '#ffc9d2', side: THREE.DoubleSide} );
        
        const plane = new THREE.Mesh( geometryPlane, materialPlane );
        plane.rotation.x = -Math.PI/2;
        plane.position.y = 0;
        scene.add( plane );

        const pointLight = new THREE.PointLight('#000000');
        pointLight.position.set(5, 5, 5);

        const ambientLight = new THREE.AmbientLight('#000000');
        scene.add(pointLight, ambientLight);
        const lightHelper = new THREE.PointLightHelper(pointLight)
        const gridHelper = new THREE.GridHelper(1000, 1000);
        scene.add(lightHelper, gridHelper)


        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.material = material
        this.cube = cube

        this.mount.appendChild(this.renderer.domElement)
        this.start()
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
        cancelAnimationFrame(this.frameId)
    }

    animate() {
        this.cube.rotation.x += 0.01
        this.cube.rotation.y += 0.01

        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera)
    }

    render() {
    return (
    <div
        style={{ width: '100%', height: 'calc(100vh - 150px)' }}
        ref={(mount) => { this.mount = mount }}
    />
    )
    }
}

export default Scene