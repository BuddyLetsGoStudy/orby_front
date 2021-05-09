import axios from "axios"
import { API_DOMAIN, AUTH_CONFIG, AUTH_JSON_CONFIG, AUTH_FORM_CONFIG } from "../variables"
import store from '../store';
import _ from 'lodash';

export const createSpace = (id) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('WHEYFGDNIJKORWEGRJDN')
      dispatch({
        type: "SPACE_CREATE_LOADING"
      });
      if (!store.getState().Space.edit) {
        const { name, description, geo, date, avatarRaw, positions, artobjects } = store.getState().Space.space
        console.log(artobjects, artobjects.map(el => (parseInt(el.id, 10))))
        const bodyava = new FormData();
        bodyava.append("upload", avatarRaw)
        const avatarRes = await axios.post(`${API_DOMAIN}/spacesavatars/`, bodyava, AUTH_FORM_CONFIG());
  
        const body = {
          name,
          description,
          artobjects: artobjects.map(el => (parseInt(el.id, 10))),
          geo: `${geo[0]},${geo[1]}`,
          date,
          options: JSON.stringify({positions: positions}),
          avatar: avatarRes.data.upload
        }
        // body.append("name", name)
        // body.append("description", description)
        // body.append("avatar", avatarRaw)
        // body.append("geo", geo)
        // body.append("date", date)
        // body.append("artobjects", artobjects.map(el => (parseInt(el.id, 10))))
        // body.append("options", JSON.stringify({positions: positions}))
  
        const res = await axios.post(`${API_DOMAIN}/spaces/`, body, AUTH_JSON_CONFIG());
        resolve(res.data.id)
        dispatch({
          type: "SPACE_CREATE_SUCCESS",
          payload: res.data,
        })
        // window.location.href = `http://localhost:3000/edit/${res.data.id}`
      } else {
        const { name, description, geo, date, positions, artobjects } = store.getState().Space.space
        let { avatar } = store.getState().Space.space;
        if (avatar[0] !== 'h') {
          const bodyava = new FormData();
          bodyava.append("upload", avatar)
          const avatarRes = await axios.post(`${API_DOMAIN}/spacesavatars/`, bodyava, AUTH_FORM_CONFIG());
          avatar = avatarRes.data.upload
        }

        const body = {
          name,
          description,
          artobjects: artobjects.map(el => (parseInt(el.id, 10))),
          geo: `${geo[0]},${geo[1]}`,
          date,
          options: JSON.stringify({positions: positions}),
          avatar
        }

        const res = await axios.put(`${API_DOMAIN}/spaces/${id}/`, body, AUTH_JSON_CONFIG());
        resolve(res.data.id)
        dispatch({
          type: "SPACE_CREATE_SUCCESS",
          payload: res.data,
        })
      }
      
    } catch (e) {
      reject()
      dispatch({
        type: "SPACE_CREATE_ERROR",
      })
    }
  })
};

//  НЕ СМОТРИТЕ НА ДЕРЬМО ВЫШЕ ПРОСТО НАХУЙ ЗАБУДЬТЕ ЭТО СОТРИТЕ К ЧЕРТОВОЙ МАТЕРИ БОЖЕЧКИ КАК ЖЕ МНЕ ПОХУЙ

export const publishSpace = (id, param = true) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const body = {
        published: param
      }
      const res = await axios.patch(`${API_DOMAIN}/spaces/${id}/`, body, AUTH_JSON_CONFIG());
      console.log('res', res)
      dispatch({
        type: "SPACE_DEFAULT",
        payload: res.data,
      })
      resolve(res.data)
    } catch (e) {
      reject()
    }
  })
};

export const loadSpace = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(`${API_DOMAIN}/spaces/${id}/`, AUTH_JSON_CONFIG());
      console.log('res', res)
      resolve(res.data)
    } catch (e) {
      reject()
    }
  })
};



export const loadMySpaces = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(`${API_DOMAIN}/spaces/?author=${store.getState().Auth.id}`, AUTH_JSON_CONFIG());
      console.log('res', res)
      dispatch({
        type: "SPACES_GET",
        payload: res.data,
      })
      resolve(res.data)
    } catch (e) {
      reject()
    }
  })
};

export const publishMySpaces = (id, published = true) => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(id, published, 'SPACEPPSFPPL')
      const body = {
        published
      }
      const res = await axios.patch(`${API_DOMAIN}/spaces/${id}/`, body, AUTH_JSON_CONFIG());

      const updID = res.data.id;
      console.log(updID, res.data.published, 'RESSSS')
      const { spaces } = store.getState().Profile
      const updSpaces = spaces;
      updSpaces.find(space => space.id === updID).published = res.data.published;
      console.log(updSpaces.find(space => space.id === updID).published, 'udated field')
      dispatch({
        type: "SPACES_GET",
        payload: updSpaces,
      })
      resolve(res.data)
    } catch (e) {
      reject()
    }
  })
};



export const deleteSpace = id => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.delete(`${API_DOMAIN}/spaces/${id}/`, AUTH_JSON_CONFIG());
      console.log('res', res)
      dispatch({
        type: "SPACE_DEFAULT",
        payload: res.data,
      })
      resolve(res.data)
    } catch (e) {
      reject()
    }
  })
};




