import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { ShowAuthModal, LoadUser } from "../../actions/AuthActions";
import { AnimatePresence, motion } from "framer-motion"
import { Link, useHistory } from 'react-router-dom';
import { API_DOMAIN } from "../../variables"
import './styles.css'

const pageAnimation = {
    initial: {  opacity: 0},
    animate: { opacity: 1 },
    exit: {   opacity: 0 },
    transition: { duration: 0.3 }
}

const Navbar = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    const authState = useSelector(state => state.Auth);
    const searchState = useSelector(state => state.Search);
    
    useEffect(() => {
        console.log('pedik')
        dispatch(LoadUser())
    }, [])

    const submitSearch = e => {
        e.preventDefault()
        e.target[0].value?.trim() && history.push(`/search/${e.target[0].value}`)
    }

    const searchChanged = e => dispatch({type: 'SEARCH_QUERY_CHANGE', payload: e.target.value})

    return (
        <div className={'navbar'}>
            <div className={'navbar-cont'}>
                <Link to="/" className={'navbar-logo'}/>
                <form className={'navbar-search-input-cont'} onSubmit={submitSearch}>
                    <input type="text" className={'navbar-search-input'} placeholder={'Search by creator, galleries, collection'} name={'search'} value={searchState.query} onChange={searchChanged}/>
                    <div className={'navbar-search-input-bg'}/>
                </form>
                <AnimatePresence exitBeforeEnter>
                    <motion.div className={'navbar-ul-cont-animation'} {...pageAnimation} key={authState.token}>
                        <div className={'navbar-icons'}>
                            <Link to="/" className={'navbar-icons-globus'}/>
                            <Link to="/list" className={'navbar-icons-squares'}/>
                        </div>
                        <div className={'navbar-ul'}>
                            <Link to="/create" className={'navbar-ul-li navbar-ul-li-create'}>
                                <div className={'navbar-ul-li-plus'}></div>
                                <div className={'navbar-ul-li-text'}>
                                    Create a space
                                </div>
                            </Link>
                        
                            {
                                authState.token ?
                                <>
                                <div className={'navbar-ul-li navbar-ul-li-myspaces'} >
                                    <Link to="/myspaces" className={'navbar-ul-li-text'}>
                                        My spaces
                                    </Link>
                                </div>
                                <motion.div className={'navbar-ul-li'}>
                                    <Link to="/edit/profile" className={'navbar-ul-li-text navbar-ul-li-avatar'} style={authState.avatar ? {backgroundImage: `url('${API_DOMAIN}${authState.avatar}')`} : {}} />
                                </motion.div>
                                </>
                                :
                                <div className={'navbar-ul-li'} >
                                    <div className={'navbar-ul-li-text'} onClick={() => dispatch(ShowAuthModal())}>
                                        Log In
                                    </div>
                                </div>
                            }

                            
                        </div>
                    </motion.div>
                </AnimatePresence>
                  
            </div>
        </div>
    )
}

export default Navbar
