import { combineReducers } from "redux";
import AuthReducer from './AuthReducer'
import ArtobjectsReducer from './ArtobjectsReducer'
import SpaceReducer from './SpaceReducer'
import ProfileReducer from './ProfileReducer'
import ListSpacesReducer from './ListSpacesReducer'



const rootReducer = combineReducers({
    Auth: AuthReducer,
    Artobjects: ArtobjectsReducer,
    Space: SpaceReducer,
    Profile: ProfileReducer,
    ListSpaces: ListSpacesReducer,
});

export default rootReducer;