import axios from "axios"
import { API_DOMAIN, AUTH_CONFIG, AUTH_JSON_CONFIG, AUTH_FORM_CONFIG, GUEST_CONFIG } from "../variables"
import store from '../store';
import _ from 'lodash';
import jwt_decode from "jwt-decode";


// export const LoadMyProfile = () => async dispatch => {
//     try {
//         // store.getState().Auth
//         // const res = await axios.get(`${API_DOMAIN}/api/user`, AUTH_CONFIG())
//         console.log(store.getState().Auth)
//         dispatch({
//             type: "PROFILE_LOADED",
//             payload: store.getState().Auth,
//         })
//     } catch (e) {
//         console.log(e)
//     }
// };




