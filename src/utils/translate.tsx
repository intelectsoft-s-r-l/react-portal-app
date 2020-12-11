import React from "react";
import ReactDOMServer from "react-dom/server";
import Localization from "./Localization";

const WithStringTranslate = (message: string) => {
    return ReactDOMServer.renderToString(<Localization msg={message} />);
};

export default WithStringTranslate;
