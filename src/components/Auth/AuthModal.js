import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { CloseAuthModal, LoginUser, RegUser } from "../../actions/AuthActions";
import Button from '../Button/Button'
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

    const submitLoginForm = () => {
        const email = document.getElementsByName('email')[0].value
        const password = document.getElementsByName('password')[0].value
        email && password && dispatch(LoginUser(email, password))
    }

    const submitRegForm = () => {
        const email = document.getElementsByName('email')[0].value
        const password = document.getElementsByName('password')[0].value
        const username = document.getElementsByName('login')[0].value
        console.log(email,password,username)
        email && username && password && dispatch(RegUser(email, username, password))
    }

    if (authState.showAuthModal) {
        return(
            <div className={'auth-modal'}>
                <div className={'auth-modal-cont'}>
                    {
                        modalType === 'login' ?
                            <>
                            <div className={'auth-modal-title-reg'}>Log in</div>
                            <div className={`auth-modal-error-msg ${authState.error ? 'auth-modal-error-msg-visible' : ''}`}>Incorrect username, or wrong password</div>
                            <input type='email' className={`auth-modal-input ${authState.error ? 'input-error' : ''}`} name={'email'} placeholder="E-mail address"/>
                            <div className={'auth-modal-input-pswd-cont'}>
                                <input type={showPswd ? 'text' : 'password'} className={`auth-modal-input ${authState.error ? 'input-error' : ''}`} name={'password'} placeholder="Password"/>
                                <div className={`auth-modal-input-pswd-eye ${showPswd ? 'auth-modal-input-pswd-eye-open' : ''}`} onClick={togglePassword}/>
                            </div>
                            <Button onClick={submitLoginForm} size={'medium'} text={'Log in'} fontSize={'16px'} margin={'30px 0 0 0'}/>
                            <div className={'auth-modal-register'} onClick={() => setModalType('registration')}>
                                DONT HAVE AN ACCOUNT? 
                                <span> SIGN UP</span>
                            </div>
                            </>
                        :
                            <>
                            <div className={'auth-modal-title-reg'}>Create new account</div>
                            <div className={`auth-modal-error-msg ${authState.error.email ? 'auth-modal-error-msg-visible' : ''}`}>{authState.error.email ? authState.error.email : ''}</div>
                            <input type='email' className={`auth-modal-input ${authState.error.email ? 'input-error' : ''}`} name={'email'} placeholder="E-mail address"/>
                            <div className={`auth-modal-error-msg ${authState.error.username ? 'auth-modal-error-msg-visible' : ''}`}>{authState.error.username ? authState.error.username : ''}</div>
                            <input type='text' className={`auth-modal-input ${authState.error.username ? 'input-error' : ''}`} name={'login'} placeholder="Name or nickname"/>
                            <div className={`auth-modal-error-msg ${authState.error.password ? 'auth-modal-error-msg-visible' : ''}`}>{authState.error.password ? authState.error.password : ''}</div>
                            <div className={'auth-modal-input-pswd-cont'}>
                                <input type={showPswd ? 'text' : 'password'} className={`auth-modal-input ${authState.error.password ? 'input-error' : ''}`} name={'password'} placeholder="Password"/>
                                <div className={`auth-modal-input-pswd-eye ${showPswd ? 'auth-modal-input-pswd-eye-open' : ''}`} onClick={togglePassword}/>
                            </div>
                            <Button onClick={submitRegForm} size={'medium'} text={'Lets get started'} fontSize={'16px'} margin={'30px 0 60px 0'}/>

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