import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { ShowAuthModal, LoadUser } from "../../actions/AuthActions";
import { Link } from 'react-router-dom';
import './styles.css'

const Navbar = () => {
    const dispatch = useDispatch();
    const authState = useSelector(state => state.Auth);

    useEffect(() => {
        dispatch(LoadUser())
    }, [])

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
                    {
                        authState.token ?
                        <>
                        <div className={'navbar-ul-li'}>
                            <Link to="/myspaces" className={'navbar-ul-li-text'}>
                                My spaces
                            </Link>
                        </div>
                        <div className={'navbar-ul-li'}>
                            <div className={'navbar-ul-li-text'} onClick={() => dispatch({ type: 'LOGOUT_USER' })}>
                                {authState.username}
                            </div>
                        </div>
                        </>
                        :
                        <div className={'navbar-ul-li'}>
                            <div className={'navbar-ul-li-text'} onClick={() => dispatch(ShowAuthModal())}>
                                Log In
                            </div>
                        </div>
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default Navbar
