const DefaultState = {
    loading: false,
    artobject: {}
};
  
const ArtobjectsReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case "ARTOBJECT_UPLOAD_LOADING":
            return {
                ...state,
                loading: true
            }
        case "ARTOBJECT_UPLOAD_SUCCESS":
            return {
                ...state,
                artobject: action.payload,
                loading: false,
            }
        case "ARTOBJECT_UPLOAD_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        default:
            return state
    }
};

export default ArtobjectsReducer