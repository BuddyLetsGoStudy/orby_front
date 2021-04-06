const DefaultState = {
    showAuthModal: false
};
  
const AuthReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case "SHOW_AUTHMODAL":
            return {
                ...state,
                showAuthModal: true
            };
        case "CLOSE_AUTHMODAL":
            return {
                ...state,
                showAuthModal: false
            };
        default:
            return state
    }
};

export default AuthReducer