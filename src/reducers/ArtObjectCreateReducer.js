const DefaultState = {
    loading: false,
    data: [],
    errorMsg: "",
  };
  
  const ArtObjectCreateReducer = (state = DefaultState, action) => {
    switch (action.type) {
      case "ARTOBJECT_CREATE_LOADING":
        return {
          ...state,
          loading: true,
          errorMsg: ""
        };
      case "ARTOBJECT_CREATE_FAIL":
        return {
          ...state,
          loading: false,
          errorMsg: "unable to upload artobject"
        };
      case "ARTOBJECT_CREATE_SUCCESS":
        return {
          ...state,
          loading: false,
          data: action.payload.results,
          errorMsg: "",
          count: action.payload.count
        };
      default:
        return state
    }
  };
  
  export default ArtObjectCreateReducer
  
  