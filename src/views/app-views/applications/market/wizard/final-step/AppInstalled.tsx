import * as React from "react";
import Flex from "../../../../../../components/shared-components/Flex";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
const AppInstalled = ({ isInstalled }: { isInstalled: boolean }) => {
  if (isInstalled) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <div style={{ textAlign: "center" }}>
          <div className="mb-3">
            <img
              width="150"
              src={`${process.env.PUBLIC_URL}/img/check.svg`}
              alt="Successfully installed"
            />
          </div>
          <h3>
            <IntlMessage id="wizard.install.success.title" />
          </h3>
          <p>
            <IntlMessage id="wizard.install.success.content" />
          </p>
        </div>
      </Flex>
    );
  } else {
    return (
      <Flex justifyContent="center" alignItems="center">
        <div style={{ textAlign: "center" }}>
          <div className="mb-3">
            <img
              width="150"
              src={`${process.env.PUBLIC_URL}/img/remove.svg`}
              alt="Failed installation"
            />
          </div>
          <h3>
            <IntlMessage id="wizard.install.error.title" />
          </h3>
          <p>
            <IntlMessage id="message.Error" />
          </p>
        </div>
      </Flex>
    );
  }
};
export default AppInstalled;
