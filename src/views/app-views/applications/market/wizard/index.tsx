import { Button, Checkbox, Modal, Steps } from "antd";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import { APP_PREFIX_PATH } from "../../../../../configs/AppConfig";
import { IState } from "../../../../../redux/reducers";
import TranslateText from "../../../../../utils/translate";
import { MarketContext } from "../MarketContext";
import FinalStep from "./final-step";
import TermsModal from "./TermsWizard";
const steps = [
  {
    title: "Terms",
    content: <TermsModal />,
  },
  {
    title: "Loading",
    content: <FinalStep />,
  },
];
const InstallWizard = ({ apps }: any) => {
  const loading = useSelector((state: IState) => state["auth"]!.loading);
  const locale = useSelector((state: IState) => state["theme"]!.locale);
  const {
    current,
    visibleModal,
    handleCancel,
    setCurrent,
    isAccepted,
    setIsAccepted,
    termsAccepted,
    setTermsAccepted,
    appInstalled,
    setAppInstalled,
    selectedApp,
    getMarketApps,
  } = useContext(MarketContext);
  return (
    <Modal
      title={TranslateText("wizard.title")}
      visible={visibleModal}
      onOk={() => setCurrent(current + 1)}
      destroyOnClose
      footer={[
        <Button
          key="cancel"
          onClick={async () => {
            handleCancel();
            termsAccepted && (await getMarketApps());
          }}
          disabled={loading}
        >
          {termsAccepted
            ? TranslateText("wizard.ok")
            : TranslateText("wizard.cancel")}
        </Button>,
        <Button
          key="next"
          type="primary"
          onClick={async () => {
            setCurrent(current + 1);
            !termsAccepted && setTermsAccepted(true);
          }}
          disabled={!isAccepted || loading}
        >
          {termsAccepted ? (
            <Link to={`${APP_PREFIX_PATH}/applications/${selectedApp.AppType}`}>
              <IntlMessage id="wizard.go" />
            </Link>
          ) : (
            <IntlMessage id="wizard.next" />
          )}
        </Button>,
      ]}
    >
      <div>{steps[current]["content"]}</div>
    </Modal>
  );
};

export default InstallWizard;
