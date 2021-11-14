import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import * as Cesium from "cesium";
import { AnimatePresence, motion } from "framer-motion"
import { pageAnimation } from '../../variables'
import './styles.css'

const CesiumTest = () => {
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MmY3NjNmZS1hYzZhLTRmZTUtOGQwOS0wYWU4NzRhODM3NDIiLCJpZCI6NzI1NjUsImlhdCI6MTYzNjc1ODk5NH0.ynkAqSd3XNzEJssUG3yissMf7wI9x8ahnA-0ninyyDc"
        var positron = new Cesium.UrlTemplateImageryProvider({
          url : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          credit : 'Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
      });
        const viewer = new Cesium.Viewer(document.getElementById("main"), {
            imageryProvider: positron,
            timeline: false,
            animation : false,
            contextOptions : { alpha : true},
            shadows: false

            });

        const cancelFlight = () => viewer.scene.camera.cancelFlight()
           
        document.body.addEventListener('mousedown', cancelFlight)
        document.addEventListener('wheel', cancelFlight)

        viewer.scene.backgroundColor = Cesium.Color.fromBytes(245,247,254,255);

        viewer.scene.skyBox.destroy();
        viewer.scene.skyBox = undefined;
        viewer.scene.sun.destroy();
        viewer.scene.sun = undefined;
        viewer.scene.moon.destroy();
        viewer.scene.moon = undefined;
        viewer.scene.skyAtmosphere.destroy();
        viewer.scene.skyAtmosphere = undefined;
        viewer.scene.globe.showGroundAtmosphere = false
        // viewer.camera.position = new Cesium.Cartesian3.fromDegrees(37.63015658378601, 55.75658004848549, 1);
        
      const preloader = queuedTileCount => {
        if(viewer.scene.globe.tilesLoaded){
          console.log('tilesLoaded')
          viewer.scene.globe.tileLoadProgressEvent.removeEventListener(preloader)
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(37.63015, 55.75658, 15000.0),
            duration: 4
        });
        }
      }

      viewer.selectionIndicator.destroy()
      const popupElem = document.createElement('div')
      popupElem.classList.add('globe-popup')
      popupElem.innerHTML = `
      <a href="https://orby.space/space/1" class="globe-cont"> 
        <div class="globe-header" style="background-image: url('https://api.orby.space/media/common/fucker.svg')">
            <div class="globe-header-avatar" style="background-image: url('https://api.orby.space/media/common/fucker.svg')"></div>
        </div>
        <div class="globe-text">
            <div class="globe-text-title">Penis</div>
            <div class="globe-text-geo">Dude</div>
            <div class="globe-text-arrow"></div>
        </div>
      </a>
      `
      // viewer.container.appendChild(popupElem);

      // var entity = viewer.entities.add({
      //   position : Cesium.Cartesian3.fromDegrees(-76.166493, 39.9060534),
      //   billboard : {
      //    image: 'https://api.orby.space/media/common/fucker.svg',
      //    width: 32,
      //    height: 32
      // }
      // });

// =========================================================
      // var isEntityVisible = true;
      // var scratch3dPosition = new Cesium.Cartesian3();
      // var scratch2dPosition = new Cesium.Cartesian2();
 
      // // Every animation frame, update the HTML element position from the entity.
      // viewer.clock.onTick.addEventListener(function(clock) {
      //     var position3d;
      //     var position2d;
      //     // Not all entities have a position, need to check.
      //     if (entity.position) {
      //         position3d = entity.position.getValue(clock.currentTime, scratch3dPosition);
      //     }
          
      //     // Moving entities don't have a position for every possible time, need to check.
      //     if (position3d) {
      //         position2d = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      //             viewer.scene, position3d, scratch2dPosition);
      //             console.log({position2d, position3d})
                
      //     }
      
      //     // Having a position doesn't guarantee it's on screen, need to check.
      //     if (position2d) {
      //         // Set the HTML position to match the entity's position.
      //         popupElem.style.left = position2d.x + 'px';
      //         popupElem.style.top = position2d.y + 'px';
              
      //         // Reveal HTML when entity comes on screen
      //         if (!isEntityVisible) {
      //             isEntityVisible = true;
      //             popupElem.style.display = 'block';
      //         }
      //     } else if (isEntityVisible) {
      //         console.log('NOOOOOOOOOO VISIBLE')
      //         // Hide HTML when entity goes off screen or loses its position.
      //         isEntityVisible = false;
      //         popupElem.style.display = 'none';
      //     }
      // });
      
   

      
  
      viewer.scene.globe.tileLoadProgressEvent.addEventListener(preloader);
      // viewer.scene.globe.tileCacheSize = 100
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 30000000
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 600

        // viewer.entities.add({
        
        //   name: "tokyo",
        
        //   description: "test",
        //   position: Cesium.Cartesian3.fromDegrees(37.63015658378601, 55.75658004848549, 100),
        
        //   point: { pixelSize: 10 }
        
        // });

        return(() => {
          console.log('fuck you burn in hell bb')
          document.body.removeEventListener('mousedown', cancelFlight)
          document.removeEventListener('wheel', cancelFlight)
          viewer.scene.globe.tileLoadProgressEvent.removeEventListener(preloader)
        })
        
    }, [])
    return (
        <motion.div id={"main"} {...pageAnimation}/>
    )
}

export default CesiumTest
