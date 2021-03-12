import React from "react";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";
import { APP_NAME } from "../../../../configs/AppConfig";
import Flex from "../../../../components/shared-components/Flex";

const Error = () => {
  return (
    <div className="h-100 bg-white">
      <div className="container-fluid d-flex flex-column justify-content-between h-100 px-md-4">
        <div className="mt-2">
          <img
            className="img-fluid"
            src={process.env.PUBLIC_URL + "/img/is-logo-pic.png"}
            alt=""
          />
        </div>
        <Result
          status="404"
          title="Incorrect token"
          subTitle="Sorry, the token you have submitted is no longer available!"
          extra={
            <Link to="/app">
              <Button type="primary">Find your way</Button>
            </Link>
          }
        />
        <Flex mobileFlex={true} justifyContent="between" className="mb-2">
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
              Terms & Conditions
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

export default Error;
