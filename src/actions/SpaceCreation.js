import axios from "axios"
import { API_DOMAIN, AUTH_CONFIG } from "../variables"
import store from '../store';


export const createSpace = () => async dispatch => {
    try {
      console.log('WHEYFGDNIJKORWEGRJDN')
      dispatch({
        type: "SPACE_CREATE_LOADING"
      });

      const { name, description, geo, date, avatarRaw, positions, artobjects } = store.getState().Space.space

      const body = new FormData();
      body.append("name", name)
      body.append("description", description)
      body.append("avatar", avatarRaw)
      body.append("geo", geo)
      body.append("date", date)
      body.append("artobjects", artobjects.map(el => (el.id)))
      body.append("options", JSON.stringify({positions: positions}))

      const res = await axios.post(`${API_DOMAIN}/spaces/`, body, AUTH_CONFIG);
  
      dispatch({
        type: "SPACE_CREATE_SUCCESS",
        payload: res.data,
      })
    } catch (e) {
      dispatch({
        type: "SPACE_CREATE_ERROR",
      })
    }
  };