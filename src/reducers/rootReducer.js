import { combineReducers } from "redux";
import AuthReducer from './AuthReducer'
import ArtobjectsReducer from './ArtobjectsReducer'
import SpaceReducer from './SpaceReducer'


const rootReducer = combineReducers({
    Auth: AuthReducer,
    Artobjects: ArtobjectsReducer,
    Space: SpaceReducer
});

export default rootReducer;