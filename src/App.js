import React, { Fragment } from 'react';
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import SpaceCreate from './components/SpaceCreate/SpaceCreate';
import SpaceEdit from './components/SpaceEdit/SpaceEdit';
import MySpaces from './components/MySpaces/MySpaces';

import Navbar from './components/Navbar/Navbar';
import AuthModal from './components/Auth/AuthModal';


const App = () => (
  <Fragment>
    <Navbar />
    <Switch>
        <Route path={"/edit/:spaceid"} component={SpaceEdit} />
        <Route path={"/create"} exact component={SpaceCreate} />
        <Route path={"/myspaces"} exact component={MySpaces} />
        <Redirect to={"/"} />
    </Switch>
    <AuthModal />
  </Fragment>

)
    

export default App;

