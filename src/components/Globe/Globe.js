import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ShowAuthModal, LoadUser } from "../../actions/AuthActions";
import { AnimatePresence, motion } from "framer-motion"
import { pageAnimation } from '../../variables'
import { Link, useHistory } from 'react-router-dom';
import CesiumTest from '../CesiumTest/CesiumTest'
import './styles.css';


const Globe = () => {
  const dispatch = useDispatch();
  const history = useHistory()
  const [ hint, changeHint ] = useState(false)
  const [ plus, changePlus ] = useState(false)
  const [ zoom, changeZoom ] = useState(false)

  const authState = useSelector(state => state.Auth)

  useEffect(() => {
      let plusTimeout, hintTimeout, zoomTimeout, zoomDeletionTimeout = null;

      if(authState.hints && !plus) plusTimeout = setTimeout(() => changePlus(true), 4000)
      if(authState.hints && !hint) hintTimeout = setTimeout(() => changeHint(true), 7000)
      if(authState.hints && !zoom) zoomTimeout = setTimeout(() => {
        changeZoom(true)
        document.addEventListener("wheel", () => {
          zoomDeletionTimeout = setTimeout(() => changeZoom(false), 1000)
        })
      }, 1000)
    
      return () => {
        plusTimeout && clearTimeout(plusTimeout)
        hintTimeout && clearTimeout(hintTimeout)
        zoomTimeout && clearTimeout(zoomTimeout)
        zoomDeletionTimeout && clearTimeout(zoomDeletionTimeout)
      }
    }, []);

    const plusClicked = () => {
      console.log(authState.token)
      authState.token ? history.push('/create') : dispatch(ShowAuthModal())
    }
  
  return (
    <>
      {/* <div id="earth_div"></div> */}
      <CesiumTest />
      <AnimatePresence exitBeforeEnter>
        {
          zoom &&
              <motion.div className="globe-zoom-cont" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <div className={"globe-zoom"}>Use mouse scroll to zoom</div>
              </motion.div>

        }
            </AnimatePresence>

            <AnimatePresence exitBeforeEnter>

        {
          plus &&
          <motion.div className="globe-plus-cont" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <div className="globe-plus-bg">
              <AnimatePresence exitBeforeEnter>
                {
                    hint &&  
                    <motion.div className={"globe-plus-hint"} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                        <div className={"globe-plus-hint-text"}>Hey! Let’s create your own space 🙂</div>
                        <div className={"globe-plus-hint-close"} onClick={() => changeHint(false)}/>
                    </motion.div>
                }
              </AnimatePresence>
              <div onClick={plusClicked} className="globe-plus">
                <div className="globe-plus-icon"/>
              </div>
              <motion.div className="globe-plus-bg-glow" initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: 2, yoyo: Infinity}}} exit={{opacity: 0}}/>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </>
  )
}


export default Globe
