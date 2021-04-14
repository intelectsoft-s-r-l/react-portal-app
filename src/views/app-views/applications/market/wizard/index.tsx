import React, { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Modal } from "antd";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import {
  APP_PREFIX_PATH,
  SMS_URL_VALIDATE,
} from "../../../../../configs/AppConfig";
import WithStringTranslate from "../../../../../utils/translate";
import { WizardContext } from "./WizardContext";
import InstallResult from "./InstallResult";
import TermsModal from "./TermsWizard";
import { EnApp } from "../../single-app-page";
import Cookies from "js-cookie";
import { appRedirect } from "../../AppCard";
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
  const history = useHistory();
  const { state, dispatch } = useContext(WizardContext);
  useEffect(() => {
    if (!steps[state.current]["content"]) {
      dispatch("HIDE_WIZARD");
    }
  }, [state.current]);

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
            state.selectedApp.AppType === EnApp.SMS ? (
              <div
                onClick={() => {
                  appRedirect(SMS_URL_VALIDATE);
                  window.location.reload();
                }}
              >
                <IntlMessage id="wizard.go" />
              </div>
            ) : (
              <Link
                to={`${APP_PREFIX_PATH}/id/${
                  state.selectedApp.AppType
                }/${state.selectedApp.Name.split(" ").join("-")}`}
              >
                <IntlMessage id="wizard.go" />
              </Link>
            )
          ) : (
            <IntlMessage id="wizard.next" />
          )}
        </Button>,
      ]}
    >
      <div>{steps[state.current] && steps[state.current]["content"]}</div>
    </Modal>
  );
};
export default InstallWizard;
