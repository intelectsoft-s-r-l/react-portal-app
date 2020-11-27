import { Row, Modal, Form, Col, Input, message } from "antd";
import React, { useState } from "react";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import { ClientApi } from "../../../api";

const CreateLicenseModal = ({
    Token,
    AppType,
    visible,
    close,
    getAppLicenses,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const onFinish = (values) => {
        return new ClientApi()
            .RequestLicense(AppType, values.Quantity)
            .then((data: any) => {
                if (data) {
                    if (data.ErrorCode === 0) getAppLicenses(AppType);
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
