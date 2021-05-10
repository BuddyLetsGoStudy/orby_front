const DefaultState = {
    username: '',
    email: '',
    avatar: '',
    avatarRaw: '',
    newPassword: '',
    newPasswordConfirm: '',
}

const EditProfileReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case "PROFILE_LOADED":
            return {
                ...state,
                username: action.payload.username,
                email: action.payload.email,
                avatar: action.payload.avatar
            }
        case "PROFILE_CHANGE":
            return {
                ...state,
                [action.payload.field]: action.payload.value
            }
        default:
            return state
    }
}

export default EditProfileReducer
