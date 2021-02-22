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
interface IViews extends ITheme, IAuth, RouteComponentProps {}
export const Views = (props: IViews) => {
  const { locale, location, token } = props;
  const currentAppLocale = locale ? AppLocale[locale] : "en";
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
          <Route path={APP_PREFIX_PATH}>
            <AppLayout location={location} />
          </Route>
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

export default withRouter(connect(mapStateToProps, null)(Views));
