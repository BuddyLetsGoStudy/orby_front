import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { ShowAuthModal, LoadUser } from "../../actions/AuthActions";
import { AnimatePresence, motion } from "framer-motion"
import { Link } from 'react-router-dom';
import { API_DOMAIN } from "../../variables"
import './styles.css'

const pageAnimation = {
    initial: { translateX: '33vw', width: 0, opacity: 0},
    animate: { translateX: '0px', width: 'unset', opacity: 1 },
    exit: { translateX: '33vw', width: 0, opacity: 0 },
    transition: { duration: 0.15 }
}

const Navbar = () => {
    const dispatch = useDispatch();
    const authState = useSelector(state => state.Auth);
    
    useEffect(() => {
        dispatch(LoadUser())
    }, [])
    console.log('FUUFGIOEIUGJIRGUIOEI======================', authState.token)
    return (
        <div className={'navbar'}>
            <div className={'navbar-cont'}>
                <Link to="/" className={'navbar-logo'}/>
                <div className={'navbar-icons'}>
                    <div className={'navbar-icons-globus'}/>
                    <div className={'navbar-icons-squares'}/>
                    <div className={'navbar-icons-search'}/>
                </div>
                <div className={'navbar-ul'}>
                    <Link to="/create" className={'navbar-ul-li navbar-ul-li-create'}>
                        <div className={'navbar-ul-li-plus'}></div>
                        <div className={'navbar-ul-li-text'}>
                            Create a space
                        </div>
                    </Link>
                    <AnimatePresence exitBeforeEnter>

                    <motion.div className={'navbar-ul-cont-animation'} {...pageAnimation} key={authState.token}>
                    {
                        authState.token ?
                        <>
                        <motion.div className={'navbar-ul-li navbar-ul-li-myspaces'} >
                            <Link to="/myspaces" className={'navbar-ul-li-text'}>
                                My spaces
                            </Link>
                        </motion.div>
                        <motion.div className={'navbar-ul-li'}>
                            <Link to="/edit/profile" className={'navbar-ul-li-text navbar-ul-li-avatar'} style={authState.avatar ? {backgroundImage: `url('${API_DOMAIN}${authState.avatar}')`} : {}} />
                        </motion.div>
                        </>
                        :
                        <motion.div className={'navbar-ul-li'} >
                            <div className={'navbar-ul-li-text'} onClick={() => dispatch(ShowAuthModal())}>
                                Log In
                            </div>
                        </motion.div>
                    }
                    </motion.div>
                    </AnimatePresence>
                  
                    
                </div>
            </div>
        </div>
    )
}

export default Navbar
