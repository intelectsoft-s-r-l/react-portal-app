import React from "react";
import { APP_NAME } from "../../../configs/AppConfig";
import Footer from "../../layout-components/Footer";
import IntlMessage from "../../util-components/IntlMessage";
import Flex from "../Flex";

interface IErrorHandlePage {
  children: React.ReactNode;
}
const ErrorHandlePage = ({ children }: IErrorHandlePage) => {
  return (
    <div className="h-100 bg-white">
      <div className="container-fluid d-flex flex-column justify-content-between h-100 ">
        <div className="mt-3">
          <img
            className="img-fluid px-3"
            src={process.env.PUBLIC_URL + "/img/is-logo-pic.png"}
            alt=""
          />
        </div>
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default ErrorHandlePage;
