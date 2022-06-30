import axios from "axios"
import { API_DOMAIN, AUTH_CONFIG, AUTH_JSON_CONFIG, AUTH_FORM_CONFIG, GUEST_CONFIG } from "../variables"
import store from '../store';
import _ from 'lodash';
import jwt_decode from "jwt-decode";
import { LoadUser } from './AuthActions';
import imageCompression from 'browser-image-compression';

// export const LoadMyProfile = () => async dispatch => {
//     try {
        // store.getState().Auth
        // const res = await axios.get(`${API_DOMAIN}/api/user`, AUTH_CONFIG())
//         console.log(store.getState().Auth)
//         dispatch({
//             type: "PROFILE_LOADED",
//             payload: store.getState().Auth,
//         })
//     } catch (e) {
//         console.log(e)
//     }
// };



export const UpdateProfile = () => async dispatch => {
    try {
        const { username, email, avatarRaw, newPassword, newPasswordConfirm } = store.getState().EditProfile;
        const body = new FormData();

        username && body.append("username", username)
        email && body.append("email", email)

        if (avatarRaw) {
            const options = { maxWidthOrHeight: 150 }
            const compressedAvatar = await imageCompression(avatarRaw, options)
            body.append("avatar", compressedAvatar)
        }

        if(newPassword) {
            if (newPassword === newPasswordConfirm) {
                body.append("password", newPassword) 
            } else {
                dispatch({type: "EDIT_PROFILE_ERROR", payload: {password: 'Passwords not matchings'}})
                return null
            }
        }

        const res = await axios.patch(`${API_DOMAIN}/api/user`, body, AUTH_FORM_CONFIG())
        dispatch({type: "EDIT_PROFILE_SUCCESS"})
        dispatch({type: "USER_LOADED", payload: res.data})
        setTimeout(() => dispatch({type: 'PROFILE_SUCCESS_OVER'}), 1500)

    } catch(e) {
        console.log(e.response.data)
        dispatch({type: "EDIT_PROFILE_ERROR", payload: e.response.data})
    }
  };
