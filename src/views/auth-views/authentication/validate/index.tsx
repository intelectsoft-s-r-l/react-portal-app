import React, { useState, useLayoutEffect } from "react";

import ErrorOne from "../../errors/error-page-1/index";
import Success from "../success/index";
import { AuthApi } from "../../../../api";

const Validate = ({ history, match }) => {
    const [isValidated, setIsValidated] = useState(false);
    useLayoutEffect(() => {
        new AuthApi()
            .ActivateUser({
                Token: history.location.pathname.replace("/auth/validate/", ""),
            })
            .then((data: any) => {
                if (data.ErrorCode === 0) {
                    setIsValidated(true);
                } else {
                    setIsValidated(false);
                }
            });
    }, [history]);

    return <>{isValidated ? <Success /> : <ErrorOne />}</>;
};

export default Validate;
