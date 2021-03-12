import React, { useState, useLayoutEffect } from "react";
import axios from "axios";
import ErrorOne from "../../errors/error-page-1/index";
import Error from "../error";
import Success from "../success";
import { API_AUTH_URL } from "../../../../configs/AppConfig";
import { RouteComponentProps } from "react-router-dom";
import Loading from "../../../../components/shared-components/Loading";

const Validate = ({ history, match }: RouteComponentProps) => {
  const [isValidated, setIsValidated] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  useLayoutEffect(() => {
    axios
      .get(`${API_AUTH_URL}/ActivateUser`, {
        params: {
          Token: history.location.pathname.replace("/auth/validate/", ""),
        },
      })
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        if (response.data["ErrorCode"] === 0) {
          setIsValidated(true);
        } else {
          setIsValidated(false);
        }
      });
  }, [history]);

  if (loading) return <Loading />;
  return <>{isValidated ? <Success /> : <Error />}</>;
};

export default Validate;
