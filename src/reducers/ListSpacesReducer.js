const DefaultState = {
    spaces: []
}

const ListSpacesReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case "ALLSPACES_GET":
            return {
                ...state,
                spaces: action.payload
            }
        default:
            return state
    }
}

export default ListSpacesReducer
