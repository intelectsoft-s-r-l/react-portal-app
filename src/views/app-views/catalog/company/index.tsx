import React, { useState } from "react";
import CompanyForm from "./CompanyForm";

const Company = () => {
    const [textMask, setTextMask] = useState<any>();
    const onChangeMask = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextMask({ [e.target.name]: e.target.value });
    };
    return <CompanyForm onChangeMask={onChangeMask} />;
};

export default Company;
