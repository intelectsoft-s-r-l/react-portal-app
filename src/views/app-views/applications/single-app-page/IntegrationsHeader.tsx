import { Button, Col, Input, message, Modal, Row } from "antd";
import Axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PageHeaderAlt from "../../../../components/layout-components/PageHeaderAlt";
import Flex from "../../../../components/shared-components/Flex";
import { API_IS_CLIENT_SERVICE } from "../../../../constants/ApiConstant";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import { signOut } from "../../../../redux/actions/Auth";

const IntegrationsHeader = ({
    apiKey,
    setApiKey,
    AppID,
    Token,
    activationCode,
    setActivationCode,
}) => {
    const { confirm } = Modal;
    const dispatch = useDispatch();
    const generateApiKey = () => {
        confirm({
            title: "Are you sure you want to generate a new API Key?",
            onOk: () =>
                Axios.post(`${API_IS_CLIENT_SERVICE}/GenerateApiKey`, {
                    AppID,
                    Token,
                }).then((res) => {
                    console.log(res.data);
                    if (res.data.ErrorCode === 0) {
                        message
                            .loading("Loading...", 1)
                            .then(() => {
                                setApiKey(res.data.ApiKey);
                            })
                            .then(() => message.success("Done!", 1.5));
                    } else if (res.data.ErrorCode === 118) {
                        message
                            .loading("Time has expired... Redirecting!")
                            .then(() => dispatch(signOut()));
                    }
                }),
            onCancel: () => {},
        });
    };

    const deleteApiKey = () => {
        confirm({
            title: "Are you sure you want to delete current API Key?",
            onOk: () =>
                Axios.post(`${API_IS_CLIENT_SERVICE}/DeleteApiKey`, {
                    AppID,
                    Token,
                }).then((res) => {
                    console.log(res.data);
                    if (res.data.ErrorCode === 0) {
                        message.success("Done!", 1.5);
                        setApiKey("00000000-0000-0000-0000-000000000000");
                    } else if (res.data.ErrorCode === 118) {
                        message
                            .loading("Time has expired... Redirecting!")
                            .then(() => signOut());
                    }
                }),
            onCancel: () => {},
        });
    };
    const generateActivationCode = () => {
        confirm({
            title: "Are you sure you want generate a new activation code?",
            onOk: () =>
                Axios.post(
                    `${API_IS_CLIENT_SERVICE}/GenerateLicenseActivationCode`,
                    {
                        AppID,
                        Token,
                    }
                ).then((res) => {
                    console.log(res.data);
                    if (res.data.ErrorCode === 0) {
                        message
                            .loading("Loading...", 1)
                            .then(() => {
                                setActivationCode(res.data.ActivationCode);
                            })
                            .then(() => message.success("Done!", 1.5));
                    } else if (res.data.ErrorCode === 118) {
                        message
                            .loading("Time has expired... Redirecting!")
                            .then(() => signOut());
                    }
                }),
            onCancel: () => {},
        });
    };
    return (
        <PageHeaderAlt className="bg-white border-bottom mb-3">
            <Row justify="space-between">
                <Col xl={8}>
                    <div className="container-fluid">
                        <h2>API Key</h2>
                    </div>
                    <Input disabled value={apiKey} />
                    <Button
                        type="ghost"
                        className="mt-3"
                        onClick={() => generateApiKey()}
                    >
                        Generate
                    </Button>
                    <Button
                        danger
                        className="mt-3 ml-3"
                        onClick={() => deleteApiKey()}
                    >
                        Delete
                    </Button>
                </Col>
                <Col xl={8}>
                    <div className="container-fluid">
                        <h2>Activation Code</h2>
                    </div>
                    <Input disabled value={activationCode} />
                    <Button
                        type="ghost"
                        className="mt-3"
                        onClick={() => generateActivationCode()}
                    >
                        Refresh
                    </Button>
                </Col>
            </Row>
        </PageHeaderAlt>
    );
};

export default IntegrationsHeader;
