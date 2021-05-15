import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { UpdateProfile } from "../../actions/Profile";
import { Link } from 'react-router-dom';
import { API_DOMAIN } from "../../variables"
import './styles.css'

const EditProfile = () => {
    const dispatch = useDispatch();
    const editProfileState = useSelector(state => state.EditProfile);

    const imageChange = e => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        
        reader.onloadend = () => {
            const image = new Image();
            image.src = reader.result;
            image.onload = e => {
                dispatch({type: 'PROFILE_CHANGE', payload: {field: 'avatar', value: reader.result}})
                dispatch({type: 'PROFILE_CHANGE', payload: {field: 'avatarRaw', value: file}})
            }
        }
        reader.readAsDataURL(file);
    }

    const onChange = e => dispatch({type: 'PROFILE_CHANGE', payload: {field: e.target.name, value: e.target.value}})


    useEffect(() => {
        // dispatch(LoadMyProfile())
    }, [])

    const { email, username, avatar, avatarRaw, errors, newPassword, newPasswordConfirm, success, changed } = editProfileState
    return (
        <div className={'edit-profile'}>
            <div className={'edit-profile-title'}>Edit profile</div>
            <div className={'edit-profile-cont'}>
                <div className={'edit-profile-avatar'} style={{backgroundImage: avatar ? `url('${avatarRaw ? '' : API_DOMAIN}${avatar}')` : ''}}>
                    {
                        !avatar &&
                        <div className={'edit-profile-avatar-text'}>
                            <span>Upload</span> your profile avatar
                        </div>
                    }
                    <input type="file" className={'edit-profile-avatar-input'} onChange={imageChange} name="avatar" accept="image/*"></input>
                </div>
                <div className={'edit-profile-inputs'}>
                    <input type='text' className={'edit-profile-input-mimic'} />
                    <input type='password' className={'edit-profile-input-mimic'} />
                    <div>
                        <div className={'edit-profile-input-title'}>E-mail</div>
                        <input type='email' name='email' className={`edit-profile-input ${errors.email ? 'input-error' : ''}`} placeholder='sex@drugs.com' autocomplete="off" value={email} onChange={onChange}/>
                        <div className={`auth-modal-error-msg ${errors.email ? 'auth-modal-error-msg-visible edit-profile-error-msg' : ''}`}>{errors.email ? errors.email : ''}</div>
                    </div>
                    <div>
                        <div className={'edit-profile-input-title'}>Username</div>
                        <input type='text' name='username' className={`edit-profile-input ${errors.username ? 'input-error' : ''}`} placeholder='torch' autocomplete="off" value={username} onChange={onChange}/>
                        <div className={`auth-modal-error-msg ${errors.username ? 'auth-modal-error-msg-visible edit-profile-error-msg' : ''}`}>{errors.username ? errors.username : ''}</div>
                    </div>
                    <div>
                        <div className={'edit-profile-input-title'}>Change password</div>
                        {/* <input type='password' name='currentPassword' className={'edit-profile-input'} placeholder='Current' autocomplete="off"/> */}
                        <input type='password' name='newPassword' className={`edit-profile-input ${errors.password ? 'input-error' : ''}`} placeholder='New' autocomplete="false" value={newPassword} onChange={onChange}/>
                    </div>
                    {/* <div>
                        <input type='password' name='newPassword' className={'edit-profile-input'} placeholder='New' autocomplete="false" value={newPassword} onChange={onChange}/>
                    </div> */}
                    <div>
                        <input type='password' name='newPasswordConfirm' className={`edit-profile-input ${errors.password ? 'input-error' : ''}`} placeholder='Retype new' autocomplete="false" value={newPasswordConfirm} onChange={onChange}/>
                        <div className={`auth-modal-error-msg ${errors.password ? 'auth-modal-error-msg-visible edit-profile-error-msg' : ''}`}>{errors.password ? errors.password : ''}</div>
                    </div>
                    <div>
                        <div className={'edit-profile-red-text'}  onClick={() => dispatch({type: "LOGOUT_USER"})}>Log Out</div>
                    </div>
                </div>
            </div>
            <div className={`edit-profile-success ${success ? 'edit-profile-success-visible' : ''}`}>✅ Profile updated</div>
            <div className={`edit-profile-confirm-button ${!changed ? 'button-disabled' : ''}`} onClick={() => changed && dispatch(UpdateProfile())}>Update profile</div>
        </div>
    )
}

export default EditProfile
