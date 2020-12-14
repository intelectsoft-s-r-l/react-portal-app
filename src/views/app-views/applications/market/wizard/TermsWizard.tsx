import { Checkbox, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import { IState } from "../../../../../redux/reducers";
import { MarketContext } from "../MarketContext";

const TermsWizard = () => {
    const { setIsAccepted, isAccepted, selectedApp } = React.useContext(
        MarketContext
    );
    const [terms, setTerms] = useState<any>();
    useEffect(() => {
        try {
            setTerms(JSON.parse(window.atob(selectedApp.TermsOfUse)));
        } catch {
            setTerms({ en: "", ru: "", ro: "" });
        }
    }, []);
    const locale =
        useSelector((state: IState) => state["theme"]!.locale) ?? "en";
    return (
        <>
            <div
                style={{ maxHeight: 500, overflowY: "scroll" }}
                dangerouslySetInnerHTML={{ __html: terms && terms[locale] }}
            />
            <Checkbox
                checked={isAccepted}
                className="mt-4"
                onChange={() => setIsAccepted(!isAccepted)}
            >
                <IntlMessage id="wizard.terms" />
            </Checkbox>
        </>
    );
};

export default TermsWizard;
