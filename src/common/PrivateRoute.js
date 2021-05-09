import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ShowAuthModal } from "../actions/AuthActions";
import { useDispatch, useSelector } from "react-redux";

const PrivateRoute = ({component: Component, ...rest}) => {
    const dispatch = useDispatch();
    const authState = useSelector(state => state.Auth);

    !authState.token && dispatch(ShowAuthModal())
    return (
        <Route {...rest} render={props => (
            authState.token ?
                <Component {...props} />
            : <Redirect to="/" />
        )} />
    );
};

export default PrivateRoute