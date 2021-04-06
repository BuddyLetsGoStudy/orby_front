import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { CloseAuthModal } from "../../actions/AuthActions";
import './styles.css'

const AuthModal = () => {
    const dispatch = useDispatch();
    const authState = useSelector(state => state.Auth);
    const [ modalType, setModalType ] = useState('login')
    const [ showPswd, setShowPswd ] = useState(false)

    const togglePassword = () => setShowPswd(showPswd ? false : true)

    const closeModal = () => {
        dispatch(CloseAuthModal())
        setModalType('login')
    }

    if (authState.showAuthModal) {
        return(
            <div className={'auth-modal'}>
                <div className={'auth-modal-cont'}>
                    {
                        modalType === 'login' ?
                            <>
                            <div className={'auth-modal-title-reg'}>Log in</div>
                            <input type='text' className={'auth-modal-input'} name={'login'} placeholder="Login name or e-mail address"/>
                            <div className={'auth-modal-input-pswd-cont'}>
                                <input type={showPswd ? 'text' : 'password'} className={'auth-modal-input'} name={'password'} placeholder="Password"/>
                                <div className={`auth-modal-input-pswd-eye ${showPswd ? 'auth-modal-input-pswd-eye-open' : ''}`} onClick={togglePassword}/>
                            </div>
                            <div className={'auth-modal-confirm'}>Log In</div>
                            <div className={'auth-modal-register'} onClick={() => setModalType('registration')}>
                                DONT HAVE AN ACCOUNT? 
                                <span> SIGN UP</span>
                            </div>
                            </>
                        :
                            <>
                            <div className={'auth-modal-title-reg'}>Create new account</div>
                            <input type='email' className={'auth-modal-input'} name={'email'} placeholder="E-mail address"/>
                            <input type='text' className={'auth-modal-input'} name={'login'} placeholder="Name or nickname"/>
                            <div className={'auth-modal-input-pswd-cont'}>
                                <input type={showPswd ? 'text' : 'password'} className={'auth-modal-input'} name={'password'} placeholder="Password"/>
                                <div className={`auth-modal-input-pswd-eye ${showPswd ? 'auth-modal-input-pswd-eye-open' : ''}`} onClick={togglePassword}/>
                            </div>
                            <div className={'auth-modal-confirm auth-modal-confirm-reg'}>Lets get started</div>
                            </>
                    }
    
                    <div className={'auth-modal-close'} onClick={closeModal}></div>
                </div>
            </div>
        );
    } else {
        return <></>
    }
    
}

export default AuthModal