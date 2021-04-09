import * as React from "react";
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
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from "../configs/AppConfig";
import { IState } from "../redux/reducers";
import { ITheme } from "../redux/reducers/Theme";
import { IAuth } from "../redux/reducers/Auth";
import Fiscal from "./auth-views/other/fiscal";
import HttpService from "../api";
interface IViews extends ITheme, IAuth, RouteComponentProps {}
function RouteInterceptor({
  component: Component,
  isAuthenticated,
  ...rest
}: any) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: AUTH_PREFIX_PATH,
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}
export const Views = (props: IViews) => {
  const { locale } = props;
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
          <Route exact path={"/fiscal"}>
            <Fiscal {...props} />
          </Route>
          <RouteInterceptor
            path={APP_PREFIX_PATH}
            isAuthenticated={new HttpService().token}
            component={AppLayout}
          />
        </Switch>
      </ConfigProvider>
    </IntlProvider>
  );
};

const mapStateToProps = ({ theme }: IState) => {
  const { locale } = theme as ITheme;
  return { locale };
};

export default withRouter(connect(mapStateToProps, null)(Views));
