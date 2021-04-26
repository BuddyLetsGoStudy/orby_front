const DefaultState = {
    loading: false,
    space: {
        name: '',
        description: '',
        geo: [0, 0],
        date: '',
        avatar: '',
        positions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        artobjects: [],
        avatarRaw: ''
    },
    uploadedSpace: {}
};
  
const SpaceReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case "UPDATE_SPACE":
            return {
                ...state,
                loading: false,
                space: {
                    ...state.space,
                    [action.payload.field]: action.payload.value
                }
            }
        case "SPACE_CREATE_LOADING":
            return {
                ...state,
                loading: true,
            }
        case "SPACE_CREATE_SUCCESS":
            return {
                space: {
                    name: '',
                    description: '',
                    geo: [0, 0],
                    date: '',
                    avatar: '',
                    positions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    artobjects: [],
                    avatarRaw: ''
                },
                uploadedSpace: action.payload
            }
        case "SPACE_CREATE_ERROR":
            return {
                space: {
                    name: '',
                    description: '',
                    geo: [0, 0],
                    date: '',
                    avatar: '',
                    positions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    artobjects: [],
                    avatarRaw: ''
                },
                loading: false,
            }
        default:
            return state
    }
};

export default SpaceReducer