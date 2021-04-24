import axios from "axios";
import { API_DOMAIN } from "../variables";
import _ from 'lodash';
import store from '../store';

export const ArtobjectUploadAndUpdate = (artobject, id) => async dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            dispatch({
                type: "ARTOBJECT_UPLOAD_LOADING"
            });
    
            const config = {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }
    
            const res = id ? await axios.put(`${API_DOMAIN}/artobjects/${id}/`, artobject, config) : await axios.post(`${API_DOMAIN}/artobjects/`, artobject, config) 
            id && dispatch({
                type: "UPDATE_SPACE",
                payload: {field: "artobjects", value: _.remove(store.getState().Space.artobjects, {id})},
            })
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
            const config = {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }

            const res = await axios.delete(`${API_DOMAIN}/artobjects/${id}/`, config)
            dispatch({
                type: "UPDATE_SPACE",
                payload: {field: "artobjects", value: _.remove(store.getState().Space.artobjects, {id})},
            })
            const newPositions = store.getState().Space.space.positions
            newPositions[store.getState().Space.space.positions.indexOf(id)] = 0
            dispatch({
                type: "UPDATE_SPACE",
                payload: {field: "positions", value: newPositions},
            })
            resolve()
        } catch(e) {
            console.log(e)
            reject()
        }
    })
}
  