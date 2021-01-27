import { Button, Checkbox, Modal, Steps } from "antd";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import { APP_PREFIX_PATH } from "../../../../../configs/AppConfig";
import { IState } from "../../../../../redux/reducers";
import WithStringTranslate from "../../../../../utils/translate";
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
    loading,
  } = useContext(MarketContext);
  return (
    <Modal
      title={WithStringTranslate("wizard.title")}
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
            ? WithStringTranslate("wizard.ok")
            : WithStringTranslate("wizard.cancel")}
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
            <Link to={`${APP_PREFIX_PATH}/id/${selectedApp.AppType}`}>
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
