import axios from "axios";
import { API_DOMAIN, AUTH_CONFIG, GUEST_CONFIG } from "../variables"
import store from '../store';



export const ShowAuthModal = (redirect = false) => async dispatch => dispatch({type: "SHOW_AUTHMODAL", payload: {redirect}});

export const CloseAuthModal = () => async dispatch => dispatch({type: "CLOSE_AUTHMODAL"});

export const LoginUser = (email, password) => async dispatch => {
    return new Promise(async (resolve, reject) => {

    try {
        dispatch({
            type: "LOGIN_USER_LOADING"
        });
    
        const body = JSON.stringify({user: { email, password }})
        const res = await axios.post(`${API_DOMAIN}/api/users/login/`, body, GUEST_CONFIG)
        const { redirect } = store.getState().Auth
        dispatch({
            type: "LOGIN_USER_SUCCESS",
            payload: res.data,
        })

        dispatch({type: 'HINTS_OFF'})
        dispatch({
            type: "PROFILE_LOADED",
            payload: res.data,
        })
        resolve(redirect)
    } catch (e) {
        console.log(e)
      dispatch({
        type: "LOGIN_USER_ERROR",
        payload: e
      })
      reject()
    }
})
  };

export const RegUser = (email, username, password) => async dispatch => {
    return new Promise(async (resolve, reject) => {

    try {
        dispatch({
            type: "REG_USER_LOADING"
        });
      

        const body = JSON.stringify({user: { email, username, password }})
        const res = await axios.post(`${API_DOMAIN}/api/users/`, body, GUEST_CONFIG)
        const { redirect } = store.getState().Auth

        dispatch({
            type: "PROFILE_LOADED",
            payload: res.data,
        })
        dispatch({
            type: "REG_USER_SUCCESS",
            payload: res.data,
        })
        dispatch({type: "HINTS_ON"})
        resolve(redirect)

    } catch (e) {
      dispatch({
        type: "REG_USER_ERROR",
        payload: e.response.data
      })
      reject()

    }
})
  };


export const LoadUser = () => async dispatch => {
    try {
        dispatch({
            type: "USER_LOADING"
        });
    
        const res = await axios.get(`${API_DOMAIN}/api/user`, AUTH_CONFIG())
        dispatch({
            type: "USER_LOADED",
            payload: res.data,
        })
        dispatch({
            type: "PROFILE_LOADED",
            payload: res.data,
        })
    } catch (e) {
        console.log(e)
        dispatch({
        type: "USER_LOADING_FAIL",
        payload: e
        })
    }
};