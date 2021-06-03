import axios from "axios";
import { API_DOMAIN, GUEST_CONFIG } from "../variables"

// export const SwitchViewType = () => async dispatch => dispatch({type: "SHOW_AUTHMODAL"});

export const searchSpaces = query => async dispatch => {
    try {
        dispatch({
            type: "SEARCH_START"
        });
    
        const res = await axios.get(`${API_DOMAIN}/spaces/?search=${query}`, GUEST_CONFIG)
        console.log(res.data)
        dispatch({
            type: "SEARCH_SUCCESS",
            payload: res.data,
        })
      
    } catch (e) {
        console.log(e)
       
    }
};