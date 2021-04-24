const DefaultState = {
    loading: false,
    space: {
        name: '',
        description: '',
        geo: '',
        positions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        artobjects: []
    }
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
        default:
            return state
    }
};

export default SpaceReducer