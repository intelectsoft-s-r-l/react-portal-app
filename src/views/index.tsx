import React, {useEffect} from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppLayout from "../layouts/app-layout";
import AuthLayout from "../layouts/auth-layout";
import AppLocale from "../lang";
import { IntlProvider } from "react-intl";
import { ConfigProvider } from "antd";
import {signOut} from "../redux/actions/Auth";

export const Views = (props) => {
  const { locale, signOut } = props;
  const currentAppLocale = AppLocale[locale];
  useEffect(() => {
    localStorage.getItem('state')  || signOut()
  })
  return (
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}
    >
      <ConfigProvider locale={currentAppLocale.antd}>
        <Switch>
          <Route exact path="/">
            <Redirect  to={locale ? '/app' : '/auth/login'} />
          </Route>
          <Route path="/auth">
            <AuthLayout />
          </Route>
          <Route path="/app">
            <AppLayout />
          </Route>
        </Switch>
      </ConfigProvider>
    </IntlProvider>
  );
};

const mapStateToProps = ({ theme, auth }) => {
  const { locale } = theme;
  const { token } = auth;
  return { locale, token };
};
const mapDispatchToProps = {
  signOut
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Views));
