import React, { useEffect, useState } from "react";
import { Checkbox } from "antd";
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
  const locale = useSelector((state: IState) => state["theme"]!.locale) ?? "en";
  return (
    <>
      <div
        style={{ maxHeight: 500, overflowY: "scroll", marginRight: "-10px" }}
        dangerouslySetInnerHTML={{
          __html: `<div class="pr-2">${terms && terms[locale]}</div>`,
        }}
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
