import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import './styles.css';

const Globe = () => {
    useEffect(() => {
        const script = document.createElement('script');
      
        script.src = "https://api.orby.space/media/common/api.js";
        script.async = true;
      
        document.body.appendChild(script);
      
        return () => {
          document.body.removeChild(script);
        }
      }, []);
      
    return (
        <>
          <div id="earth_div"></div>
          <div className="globe-plus-cont">
            <div className="globe-plus-bg">
              <div className="globe-plus">
                <div className="globe-plus-icon"/>
              </div>
            </div>
          </div>
        </>
    )
}

export default Globe
