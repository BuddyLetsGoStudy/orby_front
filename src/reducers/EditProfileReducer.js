const DefaultState = {
    username: '',
    email: '',
    avatar: '',
    avatarRaw: '',
    newPassword: '',
    newPasswordConfirm: '',
    errors: '',
    success: false,
    changed: false

}

const EditProfileReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case "PROFILE_LOADED":
            return {
                ...state,
                username: action.payload.username,
                email: action.payload.email,
                avatar: action.payload.avatar,
                avatarRaw: '',
                newPassword: '',
                newPasswordConfirm: '',
            }
        case "PROFILE_CHANGE":
            return {
                ...state,
                [action.payload.field]: action.payload.value,
                errors: '',
                success: false,
                changed: true
            }
        case "PROFILE_SUCCESS_OVER":
            return {
                ...state,
                success: false
            }
        case "EDIT_PROFILE_SUCCESS":
            return {
                ...state,
                newPassword: '',
                newPasswordConfirm: '',
                errors: '',
                success: true,
                changed: false
            }
        case "EDIT_PROFILE_ERROR":
            return {
                ...state,
                errors: action.payload,
                changed: false
            }
        default:
            return state
    }
}

export default EditProfileReducer
