import axios from "axios"
import { API_DOMAIN, AUTH_CONFIG, AUTH_JSON_CONFIG, AUTH_FORM_CONFIG, GUEST_CONFIG } from "../variables"
import store from '../store';
import _ from 'lodash';
import jwt_decode from "jwt-decode";
import imageCompression from 'browser-image-compression';

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
        let avatarURL = API_DOMAIN + '/media/avatars/spacedefault.png';
        if (avatarRaw) {
          const bodyava = new FormData();

          const compressedAvatar = await imageCompression(avatarRaw, { maxSizeMB: 9, maxWidthOrHeight: 150 })
          bodyava.append("upload", compressedAvatar)
          const avatarRes = await axios.post(`${API_DOMAIN}/spacesavatars/`, bodyava, AUTH_FORM_CONFIG());
          avatarURL = avatarRes.data.upload;
        }

        const body = {
          name,
          description,
          artobjects: artobjects.map(el => (parseInt(el.id, 10))),
          geo: `${geo[0]},${geo[1]}`,
          date,
          options: JSON.stringify({positions: positions}),
          avatar: avatarURL
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
          const res = await fetch(avatar)
          const blob = await res.blob()

          const file = new File([blob], "File",{ type: "image/png" })
          const compressedAvatar = await imageCompression(file, { maxSizeMB: 9, maxWidthOrHeight: 150 })
          bodyava.append("upload", compressedAvatar)
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
      const { username } = store.getState().Auth;
      if (!username) return 'penis'
      // const res = await axios.get(`${API_DOMAIN}/spaces/?search=${jwt_decode(store.getState().Auth.token).id}&author_username_only`, AUTH_JSON_CONFIG());
      const res = await axios.get(`${API_DOMAIN}/spaces/?search=${username}&author_username_only=${true}`, AUTH_JSON_CONFIG());

      console.log('res', res)
      dispatch({
        type: "MYSPACES_GET",
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
        type: "MYSPACES_GET",
        payload: updSpaces,
      })
      resolve(res.data)
    } catch (e) {
      reject()
    }
  })
};

export const loadAllSpaces = () => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(`${API_DOMAIN}/spaces/`, GUEST_CONFIG);
      console.log('res', res)
      dispatch({
        type: "ALLSPACES_GET",
        payload: _.filter(res.data, {published: true}),
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




