import React, { Fragment } from 'react';
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import SpacesList from './components/SpacesList/SpacesList';
import SpaceCreate from './components/SpaceCreate/SpaceCreate';
import SpaceEdit from './components/SpaceEdit/SpaceEdit';
import MySpaces from './components/MySpaces/MySpaces';
import EditProfile from './components/EditProfile/EditProfile';

import Navbar from './components/Navbar/Navbar';
import AuthModal from './components/Auth/AuthModal';
import PrivateRoute from './common/PrivateRoute';



const App = () => (
  <Fragment>
    <Navbar />
    <Switch>
        <Route path={"/"} exact component={SpacesList}/>
        <PrivateRoute path={"/edit/profile"} exact component={EditProfile} />
        <PrivateRoute path={"/edit/:spaceid"} component={SpaceEdit} />
        <PrivateRoute path={"/create"} exact component={SpaceCreate} />
        <PrivateRoute path={"/myspaces"} exact component={MySpaces} />

        <Redirect to={"/"} />
    </Switch>
    <AuthModal />
  </Fragment>

)
    

export default App;

