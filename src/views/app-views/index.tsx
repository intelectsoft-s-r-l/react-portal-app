import React, { lazy, Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from "../../components/shared-components/Loading";

export const AppViews = ({ match, history }) => {
    /* Check if the token in the redux store is null, if true log out the user */
    const token = useSelector((state) => state["auth"].token);
    const isAuth = useSelector((state) => state["auth"].isAuth);
    useEffect(() => {
        if (token === null || isAuth === false) {
            history.push("/auth/login");
        }
    }, [token, isAuth]);
    return (
        <Suspense fallback={<Loading cover="content" />}>
            <Switch>
                <Route
                    path={`${match.url}/dashboard`}
                    component={lazy(() => import(`./dashboard`))}
                />
                <Route
                    path={`${match.url}/catalog/company`}
                    component={lazy(() => import(`./catalog/company`))}
                />
                <Route
                    path={`${match.url}/catalog/users`}
                    component={lazy(() => import(`./catalog/users/UserList`))}
                />
                <Route
                    path={`${match.url}/catalog/group`}
                    component={lazy(() => import(`./catalog/group`))}
                />
                <Route
                    path={`${match.url}/security/history`}
                    component={lazy(() => import(`./security/history`))}
                />
                <Route
                    path={`${match.url}/security/rules`}
                    component={lazy(() => import(`./security/rules`))}
                />
                <Route
                    path={`${match.url}/audit`}
                    component={lazy(() => import(`./audit/all`))}
                />
                <Route
                    path={`${match.url}/audit/login-history`}
                    component={lazy(() => import(`./audit/login-history`))}
                />
                <Route
                    path={`${match.url}/reports`}
                    component={lazy(() => import(`./reports`))}
                />
                <Route
                    path={`${match.url}/account-settings`}
                    component={lazy(() => import(`./account-settings`))}
                />
                <Redirect from={`${match.url}`} to={`${match.url}/dashboard`} />
            </Switch>
        </Suspense>
    );
};

export default AppViews;
