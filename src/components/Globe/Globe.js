import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion"
import { pageAnimation } from '../../variables'
import { Link } from 'react-router-dom';
import './styles.css';

const Globe = () => {
  const [ hint, changeHint ] = useState(false)
  const [ plus, changePlus ] = useState(false)

  useEffect(() => {
      const script = document.createElement('script');
    
      script.src = "https://api.orby.space/media/common/api.js";
      script.async = true;
    
      document.body.appendChild(script);

      setTimeout(() => changePlus(true), 4000)
      setTimeout(() => changeHint(true), 5000)
    
      return () => {
        document.body.removeChild(script);
      }
    }, []);
  
  
  return (
      <>
        <div id="earth_div"></div>
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
              <Link to="/create" className="globe-plus">
                <div className="globe-plus-icon"/>
              </Link>
              <motion.div className="globe-plus-bg-glow" initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: 2, yoyo: Infinity}}} exit={{opacity: 0}}/>

            </div>
            </motion.div>
          }
      </AnimatePresence>
         

      </>
  )
}

export default Globe
