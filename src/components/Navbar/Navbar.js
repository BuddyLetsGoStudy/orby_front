import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { ShowAuthModal } from "../../actions/AuthActions";
import { Link } from 'react-router-dom';
import './styles.css'

const Navbar = () => {
    const dispatch = useDispatch();
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
                    <div className={'navbar-ul-li'}>
                        <div className={'navbar-ul-li-plus'}></div>
                        <Link to="/create" className={'navbar-ul-li-text'}>
                            Create a space
                        </Link>
                    </div>
                    <div className={'navbar-ul-li'}>
                        <div className={'navbar-ul-li-text'}>
                            My spaces
                        </div>
                    </div>
                    <div className={'navbar-ul-li'}>
                        <div className={'navbar-ul-li-text'} onClick={() => dispatch(ShowAuthModal())}>
                            Log In
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
