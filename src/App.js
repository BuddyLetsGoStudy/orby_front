import React, { Fragment } from 'react';
import { Switch, Route, NavLink, Redirect, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion"

import SpacesList from './components/SpacesList/SpacesList';
import SpaceCreate from './components/SpaceCreate/SpaceCreate';
import SpaceEdit from './components/SpaceEdit/SpaceEdit';
import MySpaces from './components/MySpaces/MySpaces';
import EditProfile from './components/EditProfile/EditProfile';
import Space from './components/Space/Space';
import Search from './components/Search/Search';


import Navbar from './components/Navbar/Navbar';
import AuthModal from './components/Auth/AuthModal';
import PrivateRoute from './common/PrivateRoute';


const App = () => {
  const location = useLocation();
  const authState = useSelector(state => state.Auth)

  return (
    <>
      <Navbar />
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
            <Route path={"/"} exact component={SpacesList}/>
            <Route path={"/search/:query"} component={Search}/>
            <Route path={"/space/:spaceid"} component={Space} />
            <PrivateRoute path={"/edit/profile"} exact component={EditProfile} />
            <PrivateRoute path={"/edit/:spaceid"} component={SpaceEdit} />
            <PrivateRoute path={"/create"} exact component={SpaceCreate} />
            <PrivateRoute path={"/myspaces"} exact component={MySpaces} />

            <Redirect to={"/"} />
        </Switch>
      </AnimatePresence>

      <AnimatePresence exitBeforeEnter>
        { authState.showAuthModal && <AuthModal /> }
      </AnimatePresence>
    </>
  )
}
    

export default App;

