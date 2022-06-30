import { combineReducers } from "redux";
import AuthReducer from './AuthReducer'
import ArtobjectsReducer from './ArtobjectsReducer'
import SpaceReducer from './SpaceReducer'
import ProfileReducer from './ProfileReducer'
import ListSpacesReducer from './ListSpacesReducer'
import EditProfileReducer from './EditProfileReducer'
import SearchReducer from './SearchReducer'


const rootReducer = combineReducers({
    Auth: AuthReducer,
    Artobjects: ArtobjectsReducer,
    Space: SpaceReducer,
    Profile: ProfileReducer,
    ListSpaces: ListSpacesReducer,
    EditProfile: EditProfileReducer,
    Search: SearchReducer,

});

export default rootReducer;