import React from "react";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";
import { APP_NAME } from "../../../../configs/AppConfig";
import Flex from "../../../../components/shared-components/Flex";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import Footer from "../../../../components/layout-components/Footer";
import ErrorHandlePage from "../../../../components/shared-components/ErrorHandlePage";

const ValidateSuccess = () => {
  return (
    <ErrorHandlePage>
      <Result
        icon={
          <img
            className="img-fluid"
            src={process.env.PUBLIC_URL + "/img/others/img-21.png"}
            alt=""
          />
        }
        title={<IntlMessage id="auth.validate.Success" />}
        extra={
          <Link to="/app">
            <Button type="primary">
              <IntlMessage id="wizard.next" />
            </Button>
          </Link>
        }
      />
    </ErrorHandlePage>
  );
};

export default ValidateSuccess;
