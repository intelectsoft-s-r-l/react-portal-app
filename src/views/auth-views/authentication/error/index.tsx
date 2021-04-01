import React from "react";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";
import ErrorHandlePage from "../../../../components/shared-components/ErrorHandlePage";

const ValidateError = () => {
  return (
    <ErrorHandlePage>
      <Result
        status="404"
        title="Incorrect token"
        subTitle="Sorry, the token you have submitted is no longer available!"
        extra={
          <Link to="/auth">
            <Button type="primary">Find your way</Button>
          </Link>
        }
      />
    </ErrorHandlePage>
  );
};

export default ValidateError;
