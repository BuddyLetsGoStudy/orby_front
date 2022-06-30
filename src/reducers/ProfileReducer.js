const DefaultState = {
    spaces: []
}

const ProfileReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case "MYSPACES_GET":
            return {
                ...state,
                spaces: action.payload
            }
        default:
            return state
    }
}

export default ProfileReducer
