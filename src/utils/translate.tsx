import React from "react";
import ReactDOMServer from "react-dom/server";
import { IntlProvider } from "react-intl";
import IntlMessage from "../components/util-components/IntlMessage";
import AppLocale from "../lang";
import store from "../redux/store";

const WithStringTranslate = (message: string) => {
  const locale = store.getState().theme.locale;
  const currentAppLocale = AppLocale[locale];
  return ReactDOMServer.renderToString(
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}
    >
      <IntlMessage id={message} />
    </IntlProvider>
  );
};

export default WithStringTranslate;
