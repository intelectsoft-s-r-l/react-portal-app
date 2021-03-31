import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Modal } from "antd";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import { APP_PREFIX_PATH } from "../../../../../configs/AppConfig";
import WithStringTranslate from "../../../../../utils/translate";
import { WizardContext } from "./WizardContext";
import InstallResult from "./InstallResult";
import TermsModal from "./TermsWizard";
const steps = [
  {
    title: "Terms",
    content: <TermsModal />,
  },
  {
    title: "Loading",
    content: <InstallResult />,
  },
];
const InstallWizard = () => {
  const { state, dispatch } = useContext(WizardContext);

  return (
    <Modal
      title={WithStringTranslate("wizard.title")}
      visible={state.visibleModal}
      onCancel={() => dispatch({ type: "HIDE_WIZARD" })}
      onOk={() => dispatch({ type: "INCREMENT" })}
      destroyOnClose
      footer={[
        <Button
          key="cancel"
          onClick={() => dispatch({ type: "HIDE_WIZARD" })}
          disabled={state.wizLoading}
        >
          {state.termsAccepted
            ? WithStringTranslate("wizard.ok")
            : WithStringTranslate("wizard.cancel")}
        </Button>,
        <Button
          key="next"
          type="primary"
          onClick={async () => {
            dispatch({ type: "INCREMENT" });
            !state.termsAccepted && dispatch({ type: "SET_TERMS_ACCEPTED" });
          }}
          disabled={!state.isAccepted || state.wizLoading}
        >
          {state.termsAccepted ? (
            <Link
              to={`${APP_PREFIX_PATH}/id/${
                state.selectedApp.AppType
              }/${state.selectedApp.Name.split(" ").join("-")}`}
            >
              <IntlMessage id="wizard.go" />
            </Link>
          ) : (
            <IntlMessage id="wizard.next" />
          )}
        </Button>,
      ]}
    >
      <div>{steps[state.current]["content"]}</div>
    </Modal>
  );
};
export default InstallWizard;
