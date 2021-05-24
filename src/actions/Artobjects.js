import axios from "axios";
import { API_DOMAIN, AUTH_CONFIG } from "../variables";
import _ from 'lodash';
import store from '../store';

export const ArtobjectUploadAndUpdate = (artobject, id) => async dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            dispatch({
                type: "ARTOBJECT_UPLOAD_LOADING"
            });
    
            const res = id ? await axios.patch(`${API_DOMAIN}/artobjects/${id}/`, artobject, AUTH_CONFIG()) : await axios.post(`${API_DOMAIN}/artobjects/`, artobject, AUTH_CONFIG()) 
            // id && dispatch({
            //     type: "UPDATE_SPACE",
            //     payload: {field: "artobjects", value: _.remove(store.getState().Space.artobjects, {id})},
            // })
            dispatch({
                type: "ARTOBJECT_UPLOAD_SUCCESS",
                payload: res.data,
            })
            resolve(res.data)

        } catch(e) {
            console.log(e)
          dispatch({
            type: "ARTOBJECT_UPLOAD_ERROR",
            payload: e
          })
          reject()
        }
    })
  };

  


export const deleteArtobject = (id) => async dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios.delete(`${API_DOMAIN}/artobjects/${id}/`, AUTH_CONFIG())

            const newPositions = store.getState().Space.space.positions
            newPositions[store.getState().Space.space.positions.indexOf(id)] = 0
            console.log(_.filter(store.getState().Space.space.artobjects, el => (el.id !== id)), newPositions, 'FUCUCCUCUUCU')
            dispatch({
                type: "UPDATE_SPACE",
                payload: {field: "positions", value: newPositions},
            })
            dispatch({
                type: "UPDATE_SPACE",
                payload: {field: "artobjects", value: _.filter(store.getState().Space.space.artobjects, el => (el.id !== id))},
            })
         
          
            resolve()
        } catch(e) {
            console.log(e)
            reject()
        }
    })
}
  