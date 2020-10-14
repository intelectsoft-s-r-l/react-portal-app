import React, { useState, useLayoutEffect } from "react";
import { API_IS_AUTH_SERVICE } from "../../../../constants/ApiConstant";
import axios from "axios";

import ErrorOne from "../../errors/error-page-1/index";
import Success from "../success/index";

const Validate = ({ history, match }) => {
  const [isValidated, setIsValidated] = useState(false);
  useLayoutEffect(() => {
    axios
      .get(`${API_IS_AUTH_SERVICE}/ActivateUser`, {
        params: {
          Token: history.location.pathname.replace("/auth/validate/", ""),
        },
      })
      .then((response) => {
        if (response.data["ErrorCode"] === 0) {
          setIsValidated(true);
        } else {
          setIsValidated(false);
        }
      });
  }, [history]);

  return <>{isValidated ? <Success /> : <ErrorOne />}</>;
};

export default Validate;
