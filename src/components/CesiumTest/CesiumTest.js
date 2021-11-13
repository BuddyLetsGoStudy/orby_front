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
          url : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          credit : 'Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
      });
        const viewer = new Cesium.Viewer(document.getElementById("main"), {
            // imageryProvider: Cesium.createWorldImagery({
            //     style: Cesium.IonWorldImageryStyle.ROAD,
            //   }),
            imageryProvider: positron,
            timeline: false,
            animation : false,
            contextOptions : { alpha : true},
            shadows: false

            });
           
       
// var shadedRelief2 = new Cesium.WebMapTileServiceImageryProvider({
//     url : 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS/tile/1.0.0/USGSShadedReliefOnly/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
//     layer : 'USGSShadedReliefOnly',
//     style : 'default',
//     format : 'image/jpeg',
//     tileMatrixSetID : 'default028mm',
//     maximumLevel: 19,
//     credit : new Cesium.Credit('U. S. Geological Survey')
// });
// viewer.imageryLayers.addImageryProvider(shadedRelief2);

        // viewer.scene.shadowMap.enabled = false
        viewer.scene.shadowMap.maximumDistance = 1.0

        viewer.scene.skyBox.destroy();
        
        viewer.scene.skyBox = undefined;
        
        viewer.scene.sun.destroy();
        
        viewer.scene.sun = undefined;
        
        viewer.scene.skyAtmosphere.destroy();
        
        viewer.scene.skyAtmosphere = undefined;
        viewer.scene.globe.showGroundAtmosphere = false

        viewer.entities.add({
        
          name: "tokyo",
        
          description: "test",
          position: Cesium.Cartesian3.fromDegrees(37.63015658378601, 55.75658004848549, 100),
        
          point: { pixelSize: 10 }
        
        });
        
    }, [])
    return (
        <motion.div id={"main"} {...pageAnimation}/>
    )
}

export default CesiumTest
