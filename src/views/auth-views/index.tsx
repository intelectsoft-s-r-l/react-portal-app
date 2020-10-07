import React, {lazy, Suspense, useEffect} from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from "../../components/shared-components/Loading";
import {signOut} from "../../redux/actions/Auth";

export const AuthViews = ({ match }) => {



  return (
    <Suspense fallback={<Loading cover="page" />}>
      <Switch>
        <Route
          path={`${match.url}/login`}
          component={lazy(() => import(`./authentication/login`))}
        />
        <Route
          path={`${match.url}/register`}
          component={lazy(() => import(`./authentication/register`))}
        />
        <Route
          path={`${match.url}/forgot-password`}
          component={lazy(() => import(`./authentication/forgot-password`))}
        />
        <Route
          path={`${match.url}/error`}
          component={lazy(() => import(`./errors/error-page-1`))}
        />
        {/*<Route*/}
        {/*  path={`${match.url}/error-2`}*/}
        {/*  component={lazy(() => import(`./errors/error-page-2`))}*/}
        {/*/>*/}
        <Redirect from={`${match.url}`} to={`${match.url}/login`} />
      </Switch>
    </Suspense>
  );
};

export default AuthViews;
