const DefaultState = {
    loading: true,
    query: '',
    spaces: [],
    viewType: 'list',
}

const SearchReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case "SEARCH_START":
            return {
                ...state,
                loading: true
            }
        case "SEARCH_SUCCESS":
            return {
                ...state,
                loading: false,
                spaces: action.payload
            }
        case "SEARCH_CHANGE_VIEWTYPE":
            return {
                ...state,
                viewType: action.payload
            }
        case "SEARCH_QUERY_CHANGE":
            return {
                ...state,
                query: action.payload
            }
        default:
            return state
    }
}

export default SearchReducer
