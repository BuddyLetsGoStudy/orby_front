import React, { Component } from 'react'
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// import GLTFLoader from 'three-gltf-loader';

export default class ThreeDPreview extends Component {
    state = {
      isLoaded: false
    }

    componentDidMount(){
        this.fileType = this.props.url.split('.').pop();
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = this.props.size === 'big' ? 19 : 17;

        this.camera.position.y = 3;

        var lights = [];
        lights[0] = new THREE.PointLight(0x304ffe, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);
        lights[0].position.set(0, 200, 0);
        lights[1].position.set(100, 200, 100);
        lights[2].position.set(-100, -200, -100);
        this.scene.add(lights[0]);
        this.scene.add(lights[1]);
        this.scene.add(lights[2]);

        const pointLight = new THREE.PointLight('#000000');
        pointLight.position.set(5, 5, 5);

        const ambientLight = new THREE.AmbientLight('#000000');
        this.scene.add(pointLight, ambientLight);

        this.addModels();
    
        this.renderScene();
        this.start();
    }
// http://localhost:8000/media/artobjects/uploads_files_2941243_retrotv0319.obj
// http://localhost:8000/media/artobjects/example-3d-map.glb
// https://betrede.com/media/img/1a_iu6BNgR.glb
// http://localhost:8000/media/artobjects/BoomBox.glb
// http://localhost:8000/media/artobjects/633e19d910b22ffc299e2e986ba46606.obj
    componentDidUpdate(prevProps){
      // console.log(prevProps, this.props)
      if(prevProps.url !== this.props.url) {
        this.scene.remove(this.upload)
        this.fileType = this.props.url.split('.').pop();
        this.addModels()
      }
    }
    
    addModels() {
        const loader = this.fileType === 'obj' ? new OBJLoader(): new GLTFLoader();

        loader.load(
            this.props.url,
            upload => {
                this.setState({isLoaded: true})
                this.upload = this.fileType === 'obj' ? upload : upload.scene

                var bbox = new THREE.Box3().setFromObject(this.upload);
                var cent = bbox.getCenter(new THREE.Vector3());
                var size = bbox.getSize(new THREE.Vector3());
            
                var maxAxis = Math.max(size.x, size.y, size.z);
                this.upload.scale.multiplyScalar(15.0 / maxAxis);
                bbox.setFromObject(this.upload);
                bbox.getCenter(cent);
                bbox.getSize(size);
 
                this.upload.position.copy(cent).multiplyScalar(-1);
                this.upload.position.y += (size.y * 0.1);
                this.upload.rotation.x = this.props.size === 'smaller' ? 0.1 : 0;
                this.scene.add( this.upload );
            },
            xhr => {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            e => {
                this.props.onError()
            }
        );
    }

    
    
      componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
      }
      start = () => {
        if (!this.frameId) {
          this.frameId = requestAnimationFrame(this.animate);
        }
      };
      stop = () => {
        cancelAnimationFrame(this.frameId);
      };
      animate = () => {
        // console.log(this.props.animate)
        if (this.upload && this.props.animate) this.upload.rotation.y += 0.01;

        if (this.freedomMesh) this.freedomMesh.rotation.y += 0.01;
    
        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate);
      };
      renderScene = () => {
        if (this.renderer) this.renderer.render(this.scene, this.camera);
      };
    
      render() {
        const { isLoaded } = this.state;
        return (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.1 }}
            animate={isLoaded && {opacity: 1, scale: 1}}
            transition={{ ease: "easeOut", duration: 0.2 }}
            className={`add-artobject-popup-3d-preview-${this.props.size}`}
            ref={mount => {
              this.mount = mount;
            }}
          />
        );
      }
}

