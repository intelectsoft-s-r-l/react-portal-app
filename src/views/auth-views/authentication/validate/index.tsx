import React, { useState, useLayoutEffect } from "react";
import axios from "axios";
import ErrorOne from "../../errors/error-page-1/index";
import Success from "../success/index";
import { AuthApi } from "../../../../api";
import { API_AUTH_URL } from "../../../../configs/AppConfig";
import { RouteComponentProps } from "react-router-dom";

const Validate = ({ history, match }: RouteComponentProps) => {
    const [isValidated, setIsValidated] = useState(true);
    useLayoutEffect(() => {
        axios
            .get(`${API_AUTH_URL}/ActivateUser`, {
                params: {
                    Token: history.location.pathname.replace(
                        "/auth/validate/",
                        ""
                    ),
                },
            })
            .then((response) => {
                console.log(response.data);
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
