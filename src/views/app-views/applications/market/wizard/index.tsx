import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Modal } from "antd";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import { APP_PREFIX_PATH } from "../../../../../configs/AppConfig";
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
const InstallWizard = () => {
  const {
    current,
    visibleModal,
    handleCancel,
    setCurrent,
    isAccepted,
    termsAccepted,
    setTermsAccepted,
    selectedApp,
    wizLoading,
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
          }}
          disabled={wizLoading}
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
          disabled={!isAccepted || wizLoading}
        >
          {termsAccepted ? (
            <Link
              to={`${APP_PREFIX_PATH}/id/${
                selectedApp.AppType
              }/${selectedApp.Name.split(" ").join("-")}`}
            >
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
