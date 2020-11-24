import { Button, Col, Input, message, Modal, Row } from "antd";
import Axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ClientApi } from "../../../../api";
import PageHeaderAlt from "../../../../components/layout-components/PageHeaderAlt";
import Flex from "../../../../components/shared-components/Flex";
import { API_APP_URL } from "../../../../configs/AppConfig";
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
    const generateApiKey = () => {
        confirm({
            title: "Are you sure you want to generate a new API Key?",
            onOk: () => {
                return new ClientApi()
                    .GenerateApiKey(AppID)
                    .then((data: any) => {
                        if (data.ErrorCode === 0) {
                            message
                                .loading("Loading...", 1)
                                .then(() => {
                                    setApiKey(data.ApiKey);
                                })
                                .then(() => message.success("Done!", 1.5));
                        }
                    });
            },
        });
    };

    const deleteApiKey = () => {
        confirm({
            title: "Are you sure you want to delete current API Key?",
            onOk: () =>
                new ClientApi().DeleteApiKey(AppID).then((data: any) => {
                    if (data.ErrorCode === 0) {
                        message.success("Done!", 1.5);
                        setApiKey("00000000-0000-0000-0000-000000000000");
                    }
                }),
            onCancel: () => {},
        });
    };
    const generateActivationCode = () => {
        confirm({
            title: "Are you sure you want generate a new activation code?",
            onOk: () =>
                new ClientApi()
                    .GenerateLicenseActivationCode(AppID)
                    .then((data: any) => {
                        if (data.ErrorCode === 0) {
                            message
                                .loading("Loading...", 1)
                                .then(() => {
                                    setActivationCode(data.ActivationCode);
                                })
                                .then(() => message.success("Done!", 1.5));
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
