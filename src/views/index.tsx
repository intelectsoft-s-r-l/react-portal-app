import React, { useEffect } from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
  RouteComponentProps,
} from "react-router-dom";
import { connect } from "react-redux";
import AppLayout from "../layouts/app-layout";
import AuthLayout from "../layouts/auth-layout";
import AppLocale from "../lang";
import { IntlProvider } from "react-intl";
import { ConfigProvider } from "antd";
import { signOut } from "../redux/actions/Auth";
import {
  APP_NAME,
  APP_PREFIX_PATH,
  AUTH_PREFIX_PATH,
  SUBDIR_PATH,
} from "../configs/AppConfig";
import { IState } from "../redux/reducers";
import { ITheme } from "../redux/reducers/Theme";
import { IAuth } from "../redux/reducers/Auth";

function RouteInterceptor({ children, isAuthenticated, ...rest }: any) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: AUTH_PREFIX_PATH + "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
interface IDispatch {
  signOut: any;
}
interface IViews extends ITheme, IAuth, RouteComponentProps, IDispatch {}
export const Views = (props: IViews) => {
  const { locale, location, token, signOut } = props;
  const currentAppLocale = locale ? AppLocale[locale] : "en";
  useEffect(() => {
    localStorage.getItem(`${SUBDIR_PATH}`) || signOut();
  }, [localStorage.getItem(`${SUBDIR_PATH}`)]);
  return (
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}
    >
      <ConfigProvider locale={currentAppLocale.antd}>
        <Switch>
          <Route exact path="/">
            <Redirect to={APP_PREFIX_PATH} />
          </Route>
          <Route path={AUTH_PREFIX_PATH}>
            <AuthLayout />
          </Route>
          <RouteInterceptor path={APP_PREFIX_PATH} isAuthenticated={token}>
            <AppLayout location={location} />
          </RouteInterceptor>
        </Switch>
      </ConfigProvider>
    </IntlProvider>
  );
};

const mapStateToProps = ({ theme, auth }: IState) => {
  const { locale } = theme as ITheme;
  const { token } = auth as IAuth;
  return { locale, token };
};

const mapDispatchToProps = {
  signOut,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Views));
