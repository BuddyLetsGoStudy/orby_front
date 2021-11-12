import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import * as Cesium from "cesium";
import { AnimatePresence, motion } from "framer-motion"
import { pageAnimation } from '../../variables'
import './styles.css'

const CesiumTest = () => {
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMzBjNGIzNS01NTBmLTQ1MTQtYTEwMi01ZjUyMzkxNDM5MGQiLCJpZCI6NzI1NjUsImlhdCI6MTYzNjEzMzYyMX0.QE_uu33TDk37tgCt_7V7xfWXqAVfg_ay83SMJ1hXgn8"
        const viewer = new Cesium.Viewer(document.getElementById("main"), {
            imageryProvider: Cesium.createWorldImagery({
                style: Cesium.IonWorldImageryStyle.ROAD,
              }),
            timeline: false,
            animation : false,
            contextOptions : { alpha : true},
            shadows: false

            });
            viewer.scene.backgroundColor = Cesium.Color.fromBytes(245,247,254,255);
        
        viewer.scene.skyBox.destroy();
        
        viewer.scene.skyBox = undefined;
        
        viewer.scene.sun.destroy();
        
        viewer.scene.sun = undefined;
        
        viewer.scene.skyAtmosphere.destroy();
        
        viewer.scene.skyAtmosphere = undefined;
        

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
