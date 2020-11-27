import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { APP_NAME } from "../../../../configs/AppConfig";
import Flex from "../../../../components/shared-components/Flex";
import IntlMessage from "../../../../components/util-components/IntlMessage";

const Success = () => {
    return (
        <div className="h-100 bg-white">
            <div className="container-fluid d-flex flex-column justify-content-between h-100 px-md-4 pb-md-4 pt-md-1">
                <div>
                    <img
                        className="img-fluid"
                        src={process.env.PUBLIC_URL + "/img/is-logo-pic.png"}
                        alt=""
                    />
                </div>
                <div className="container">
                    <div className="text-center mb-5">
                        <img
                            className="img-fluid"
                            src={
                                process.env.PUBLIC_URL +
                                "/img/others/img-21.png"
                            }
                            alt=""
                        />
                        <h1 className="font-weight-bold mb-4">
                            <IntlMessage id={"auth.validate.Success"} />
                        </h1>
                        <Link to="/auth">
                            <Button type="primary">Go to login</Button>
                        </Link>
                    </div>
                </div>
                <Flex mobileFlex={true} justifyContent="between">
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
                            <IntlMessage id={"auth.Terms&Conditions"} />
                        </a>
                        <span className="mx-2 text-muted"> | </span>
                        <a
                            className="text-gray"
                            href="/#"
                            onClick={(e) => e.preventDefault()}
                        >
                            <IntlMessage id={"auth.Privacy&Policy"} />
                        </a>
                    </div>
                </Flex>
            </div>
        </div>
    );
};

export default Success;
