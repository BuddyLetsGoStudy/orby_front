import axios from "axios";
import { API_DOMAIN, AUTH_CONFIG, AUTH_JSON_CONFIG } from "../variables";
import { createSpace } from './SpaceCreation'
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

  


export const deleteArtobject = (id, spaceid=false) => async dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios.delete(`${API_DOMAIN}/artobjects/${id}/`, AUTH_CONFIG())

            const newPositions = store.getState().Space.space.positions
            newPositions[store.getState().Space.space.positions.indexOf(id)] = 0
            dispatch({
                type: "UPDATE_SPACE",
                payload: {field: "positions", value: newPositions},
            })
            dispatch({
                type: "UPDATE_SPACE",
                payload: {field: "artobjects", value: _.filter(store.getState().Space.space.artobjects, el => (el.id !== id))},
            })
            if(store.getState().Space.edit) {
                const body = {
                    options: JSON.stringify({positions: newPositions}),
                }
                const ress = await axios.patch(`${API_DOMAIN}/spaces/${spaceid}/`, body, AUTH_JSON_CONFIG())
            }
          
            resolve()
        } catch(e) {
            console.log(e)
            reject()
        }
    })
}
  