import { Button, Col, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import Flex from "../../../../components/shared-components/Flex";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { APP_NAME } from "../../../../configs/AppConfig";

const Confirm = () => {
  return (
    <div className="h-100 bg-white">
      <div className="container-fluid d-flex flex-column justify-content-between h-100 px-md-4 pb-md-4 pt-md-1">
        <div>
          <img
            className="img-fluid"
            src={process.env.PUBLIC_URL + "/img/rsz_is-logo-dark.png"}
            alt=""
          />
        </div>
        <div className="container">
          <Row align="middle">
            <Col xs={24} sm={24} md={8}>
              <h1
                className="font-weight-bold mb-4 display-4"
                style={{ zIndex: 1000 }}
              >
                <IntlMessage id="auth.ConfirmRegistration" />
              </h1>
              <p className="font-size-md mb-4">
                <IntlMessage id="auth.ConfirmRegistration.Msg1" />{" "}
                <b>{APP_NAME}</b>{" "}
                <IntlMessage id="auth.ConfirmRegistration.Msg2" />
              </p>
              <Link to="/auth">
                <Button type="primary" icon={<ArrowLeftOutlined />}>
                  {" "}
                  <IntlMessage id="auth.GoToLogin" />
                </Button>
              </Link>
            </Col>
            <Col xs={24} sm={24} md={{ span: 14, offset: 2 }}>
              <img
                className="img-fluid mt-md-0 mt-4"
                src={process.env.PUBLIC_URL + "/img/others/img-11.png"}
                alt=""
              />
            </Col>
          </Row>
        </div>
        <Flex mobileFlex={false} justifyContent="between">
          <span>
            Copyright &copy; {`${new Date().getFullYear()}`}{" "}
            <span className="font-weight-semibold">{`${APP_NAME}`}</span>
          </span>
          <div>
            <a
              className="text-gray"
              href="/#"
              onClick={(e) => e.preventDefault()}
            >
              Term & Conditions
            </a>
            <span className="mx-2 text-muted"> | </span>
            <a
              className="text-gray"
              href="/#"
              onClick={(e) => e.preventDefault()}
            >
              Privacy & Policy
            </a>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default Confirm;
