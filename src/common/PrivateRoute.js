import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ShowAuthModal } from "../actions/AuthActions";
import { useDispatch, useSelector } from "react-redux";

const PrivateRoute = ({component: Component, ...rest}) => {
    const dispatch = useDispatch();
    const authState = useSelector(state => state.Auth);

    let redirect = !authState.token ? true : false;

    useEffect(() => {
        return () => redirect && dispatch(ShowAuthModal())
    }, [])

    return (
        <Route {...rest} render={props => (
            redirect ?
                <Redirect to="/" />
            : <Component {...props} />
        )} />
    );
};

export default PrivateRoute