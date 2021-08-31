const DefaultState = {
    loading: false,
    space: {
        name: '',
        description: '',
        geo: [0, 0],
        date: '',
        avatar: '',
        positions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        artobjects: [],
        avatarRaw: ''
    },
    uploadedSpace: {},
    step: 'artobjects',
    edit: false,
    preview: false
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
        case "UPDATE_WHOLE_SPACE":
            return {
                ...state,
                space: action.payload
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
                    positions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    artobjects: [],
                    avatarRaw: ''
                },
                uploadedSpace: action.payload,
                step: 'artobjects',
                edit: state.edit,
                loading: false,
                preview: false,

            }
        case "SPACE_CREATE_ERROR":
            return {
                ...state,
                loading: false,
            }
        case "SPACE_CREATE_STEP":
            return {
                ...state,
                step: action.payload
            }
        case "SPACE_EDIT_STEP":
            return {
                ...state,
                step: action.payload.step,
                edit: action.payload.edit
            }
        case "SPACE_EDIT_SUCCESS":
            return {
                ...state,
                edit: false
            }
        case "SPACE_DEFAULT":
            return {
                loading: false,
                space: {
                    name: '',
                    description: '',
                    geo: [0, 0],
                    date: '',
                    avatar: '',
                    positions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    artobjects: [],
                    avatarRaw: ''
                },
                uploadedSpace: {},
                step: 'artobjects',
                edit: false,
                preview: false,
            }
        case "SPACE_CLOSE":
            return {
                loading: false,
                space: {
                    name: '',
                    description: '',
                    geo: [0, 0],
                    date: '',
                    avatar: '',
                    positions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    artobjects: [],
                    avatarRaw: ''
                },
                uploadedSpace: {},
                step: 'artobjects',
                edit: false,
                preview: false,
            }
            case "SPACE_PREVIEW":
                return {
                    ...state,
                    preview: true
                }
            case "SPACE_PREVIEW_CLOSE":
                return {
                    ...state,
                    preview: false
                }
            case "LOAD_SPACE":
                return {
                    ...state,
                    space: action.payload
                }
        default:
            return state
    }
};

export default SpaceReducer