import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect, RouteComponentProps } from "react-router-dom";
import Loading from "../../components/shared-components/Loading";

export const AuthViews = ({ match }: RouteComponentProps) => {
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
                    component={lazy(
                        () => import(`./authentication/forgot-password`)
                    )}
                />
                <Route
                    path={`${match.url}/404`}
                    component={lazy(() => import(`./errors/error-page-1`))}
                />
                <Route
                    path={`${match.url}/validate/:token`}
                    component={lazy(() => import(`./authentication/validate`))}
                />

                <Route
                    path={`${match.url}/admin/:Token`}
                    component={lazy(() => import(`./authentication/admin`))}
                />
                <Route
                    path={`${match.url}/confirm`}
                    component={lazy(() => import(`./authentication/confirm`))}
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
