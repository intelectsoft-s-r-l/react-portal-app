import React from "react";
import { IntlProvider } from "react-intl";
import IntlMessage from "../components/util-components/IntlMessage";
import AppLocale from "../lang";
import store from "../redux/store";

const Localization = ({ msg }) => {
    const locale = store.getState().theme.locale;
    const currentAppLocale = AppLocale[locale];
    return (
        <IntlProvider
            locale={currentAppLocale.locale}
            messages={currentAppLocale.messages}
        >
            <IntlMessage id={msg} />
        </IntlProvider>
    );
};

export default Localization;
