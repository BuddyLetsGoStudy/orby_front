import React, { Fragment } from 'react';
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import SpaceCreate from './components/Space/SpaceCreate/SpaceCreate';
import SpaceEdit from './components/Space/SpaceEdit/SpaceEdit';
import Navbar from './components/Navbar/Navbar';


const App = () => (
  <Fragment>
    <Navbar />
    <Switch>
        <Route path={"/edit/:spaceid"} component={SpaceEdit} />
        <Route path={"/create"} exact component={SpaceCreate} />
        <Redirect to={"/"} />
    </Switch>
  </Fragment>

)
    

export default App;

