import { message } from "antd";
import { IntlProvider } from "react-intl";
import IntlMessage from "../components/util-components/IntlMessage";
import React from "react";

const ChangePasswordErrorHandler = (
  errorCode: number,
  currentAppLocale
  /* errorMessage */
): void => {
  if (errorCode === 0) {
    message.success({
      content: (
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <IntlMessage id={"account.ChangePassword.Success"} />{" "}
          {/* Change this to the errorMessage parameter, instead of handling errors manually in the locale*/}
        </IntlProvider>
      ),
      duration: 3,
    });
  } else if (errorCode === 118) {
    /* Token expired */
    // TOKEN IS NOT VALID ANYMORE, LED THE USER TO THE LOGIN PAGE
  } else if (errorCode === 119) {
    /* Incorrect old password */
    message.error({
      content: (
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <IntlMessage id={"account.ChangePassword.IncorrectPassword"} />
        </IntlProvider>
      ),
      duration: 2,
    });
  } else {
    message.error({
      content: (
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <IntlMessage id={"account.ChangePassword.Error"} />
        </IntlProvider>
      ),
      duration: 2,
    });
  }
};

export default ChangePasswordErrorHandler;
