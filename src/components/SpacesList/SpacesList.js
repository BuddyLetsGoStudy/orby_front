import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"
import { pageAnimation, API_DOMAIN } from '../../variables'
import { loadAllSpaces } from "../../actions/SpaceCreation";
import { ShowAuthModal } from "../../actions/AuthActions";
import { Link } from 'react-router-dom';
import './styles.css'
import { useHistory } from 'react-router-dom';


const SpacesList = () => {
    const history = useHistory()

    const dispatch = useDispatch();
    const listSpacesState = useSelector(state => state.ListSpaces);
    const authState = useSelector(state => state.Auth); 
    const [showPlus, showPlusUpd] = useState(false)
    const [showPlusMsg, showPlusMsgUpd] = useState(false)

    useEffect(() => {
        let showPlusTime, showPlusMsgTime = null;

        dispatch(loadAllSpaces())
        if(authState.hints.plus) {
            showPlusTime = setTimeout(() => showPlusUpd(true), 2000)
            showPlusMsgTime = setTimeout(() => showPlusMsgUpd(true), 3500) 

            dispatch({type: "HINT_SEEN", payload: {hint: 'plus'}})
        }
        return () => {
            showPlus && clearTimeout(showPlusTime)
            showPlusMsg && clearTimeout(showPlusMsgTime)
        }
    }, [])

    const plusClicked = () => {
        console.log(authState.token)
        authState.token ? history.push('/create') : dispatch(ShowAuthModal('/create'))
      }
    

    return (
        <motion.div className={'spaceslist'} {...pageAnimation}>
            <div className={'spaceslist-cont'}>
                {
                    listSpacesState.spaces.map(space => (
                        <div className={'spaceslist-block'}>
                            <Link to={`/space/${space.id}`} className={'spaceslist-block-card'}>
                                <div className={'spaceslist-block-card-bg'} style={{backgroundImage: `url('${space.artobjects[0] && space.artobjects[0].upload}')`}} />
                                <div className={'spaceslist-block-card-avatar'} style={{backgroundImage: `url('${space.avatar}')`}}/>
                                <div className={'spaceslist-block-card-bottom'}>
                                    <div className={'spaceslist-block-card-title'}>{space.name}</div>
                                    <div className={'spaceslist-block-card-geo'}>{space.author}</div>
                                </div>
                            </Link>
                        </div>
                    ))
                }
            </div>
            {showPlus &&
          <motion.div className="globe-plus-cont" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} >
            <div className="globe-plus-bg">
              <AnimatePresence >
              {showPlusMsg &&
                    <motion.div className={"globe-plus-hint"} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} >
                        <div className={"globe-plus-hint-text"}>Hey! Let’s create your own space 🙂</div>
                        <div className={"globe-plus-hint-close"} onClick={() => showPlusMsgUpd(false)}/>
                    </motion.div>}
              </AnimatePresence>
              <div onClick={plusClicked} className="globe-plus">
                <div className="globe-plus-icon"/>
              </div>
              <motion.div className="globe-plus-bg-glow" initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: 2, yoyo: Infinity}}} exit={{opacity: 0}}/>
            </div>
          </motion.div>
        }
        </motion.div>
    )
}

export default SpacesList
