import React, { useEffect } from 'react'
import { Switch, Route, NavLink, Redirect, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion"
import { isMobile } from 'react-device-detect';
import SpacesList from './components/SpacesList/SpacesList';
import SpaceCreate from './components/SpaceCreate/SpaceCreate';
import SpaceEdit from './components/SpaceEdit/SpaceEdit';
import MySpaces from './components/MySpaces/MySpaces';
import EditProfile from './components/EditProfile/EditProfile';
import Space from './components/Space/Space';
import Search from './components/Search/Search';
import Globe from './components/Globe/Globe';
import CesiumTest from './components/CesiumTest/CesiumTest';

import Navbar from './components/Navbar/Navbar';
import AuthModal from './components/Auth/AuthModal';
import PrivateRoute from './common/PrivateRoute';


const App = () => {
  const location = useLocation();
  const authState = useSelector(state => state.Auth)

  useEffect(() => {
    const first = localStorage.getItem('first')
    if(!first || isMobile) {
      localStorage.setItem('first', true)
      window.location.href = 'https://pr.orby.space';
    }
  }, [])

  return (
    <>
      <Navbar />
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
            <Route path={"/list"} exact component={SpacesList}/>
            {/* <Route path={"/"} exact component={Globe}/> */}
            <Route path={"/"} exact component={CesiumTest}/>
            <Route path={"/search/:query"} component={Search}/>
            <Route path={"/space/:spaceid"} component={Space} />
            <PrivateRoute path={"/edit/profile"} exact component={EditProfile} />
            <PrivateRoute path={"/edit/:spaceid"} component={SpaceEdit} />
            <PrivateRoute path={"/create"} exact component={SpaceCreate} />
            <PrivateRoute path={"/myspaces"} exact component={MySpaces} />
            {/* <Route path={"/cesium"} exact component={CesiumTest} /> */}

            {/* <PrivateRoute path={"/globe"} exact component={Globe} /> */}


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

