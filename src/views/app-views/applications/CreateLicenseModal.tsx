import { Row, Modal, Form, Col, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import axios from "axios";
import { API_IS_CLIENT_SERVICE } from "../../../constants/ApiConstant";
import useHttpRequest from "../../../api";

const CreateLicenseModal = ({
    Token,
    AppType,
    visible,
    close,
    signOut,
    setLicenses,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const onFinish = (values) => {
        axios
            .get(`${API_IS_CLIENT_SERVICE}/RequestAppLicense`, {
                params: { Token, AppType, Quantity: values["Quantity"] },
            })
            .then((res) => {
                console.log(res.data);
                if (res.data.ErrorCode === 0) {
                    axios
                        .get(`${API_IS_CLIENT_SERVICE}/GetAppLicensesList`, {
                            params: { Token, AppType },
                        })
                        .then((res) => {
                            setLicenses(res.data.LicenseList);
                        });
                } else if (res.data.ErrorCode === 118) {
                    message
                        .loading("Time has expired... Redirecting", 1.5)
                        .then(() => signOut());
                }
            });
    };
    const onOk = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            form.validateFields()
                .then((values) => {
                    close();
                    onFinish(values);
                })
                .catch((info) => {
                    console.log("Validate Failed:", info);
                });
        }, 1000);
    };
    return (
        <Modal
            onOk={onOk}
            onCancel={close}
            visible={visible}
            confirmLoading={isLoading}
            title="Add license"
        >
            <Form layout="vertical" form={form}>
                <Row gutter={ROW_GUTTER}>
                    <Col xs={24} sm={24} md={24}>
                        <Form.Item
                            label={"Quantity"}
                            name="Quantity"
                            rules={[
                                {
                                    required: true,
                                    message: "Please insert quantity",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
export default CreateLicenseModal;
