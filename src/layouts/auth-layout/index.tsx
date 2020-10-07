import React, {useEffect} from "react";
import { Switch, Route } from "react-router-dom";
import AuthViews from "../../views/auth-views";
// import {AUTH_TOKEN, SIGNOUT} from "../../redux/constants/Auth"
// import store from '../../redux/store';

export const AuthLayout = () => {
  // useEffect(() => {
  //   store.dispatch({ type: SIGNOUT});
  //   localStorage.removeItem(AUTH_TOKEN);
  // }, [])
  return (
    <div className="auth-container">
      <Switch>
        <Route path="" component={AuthViews} />
      </Switch>
    </div>
  );
};

export default AuthLayout;
