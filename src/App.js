import React, { Fragment } from 'react';
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import SpaceCreate from './components/SpaceCreate/SpaceCreate';

import Navbar from './components/Navbar/Navbar';
import AuthModal from './components/Auth/AuthModal';


const App = () => (
  <Fragment>
    <Navbar />
    <Switch>
        <Route path={"/edit/:spaceid"} component={SpaceCreate} />
        <Route path={"/create"} exact component={SpaceCreate} />
        <Redirect to={"/"} />
    </Switch>
    <AuthModal />
  </Fragment>

)
    

export default App;

