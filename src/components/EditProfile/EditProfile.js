import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
// import { LoadMyProfile } from "../../actions/Profile";
import { Link } from 'react-router-dom';
import { API_DOMAIN } from "../../variables"
import './styles.css'

const EditProfile = () => {
    const dispatch = useDispatch();
    const editProfileState = useSelector(state => state.EditProfile);

    useEffect(() => {
        // dispatch(LoadMyProfile())
    }, [])

    return (
        <div className={''}>
            {editProfileState.username}
            <div onClick={() => dispatch({type: "LOGOUT_USER"})}>logout</div>
        </div>
    )
}

export default EditProfile
