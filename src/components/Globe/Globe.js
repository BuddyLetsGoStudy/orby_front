import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ShowAuthModal, LoadUser } from "../../actions/AuthActions";
import { AnimatePresence, motion } from "framer-motion"
import { pageAnimation } from '../../variables'
import { Link, useHistory } from 'react-router-dom';
import './styles.css';


const Globe = () => {
  const dispatch = useDispatch();
  const history = useHistory()
  const [ hint, changeHint ] = useState(false)
  const [ plus, changePlus ] = useState(false)
  const authState = useSelector(state => state.Auth)

  useEffect(() => {
      const script = document.createElement('script');
    
      script.src = "https://api.orby.space/media/common/hui.js";
    
      document.body.appendChild(script);

      let plusTimeout = null;
      let hintTimeout = null;
      if(authState.hints && !plus) plusTimeout = setTimeout(() => changePlus(true), 4000)
      if(authState.hints && !hint) hintTimeout = setTimeout(() => changeHint(true), 7000)
    
      return () => {
        document.body.removeChild(script);
        plusTimeout && clearTimeout(plusTimeout)
        hintTimeout && clearTimeout(hintTimeout)
      }
    }, []);

    const plusClicked = () => {
      console.log(authState.token)
      authState.token ? history.push('/create') : dispatch(ShowAuthModal())
    }
  
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
