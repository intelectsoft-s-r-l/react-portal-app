import React, { useEffect } from "react";
import { Input, Row, Col, Form, Modal, message } from "antd";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import AppLocale from "../../../../lang";
import { IntlProvider } from "react-intl";
import { ClientApi } from "../../../../api";
import { DONE, ERROR } from "../../../../constants/Messages";

export const UserModalEdit = ({
    data,
    visible,
    onCancel,
    locale,
    getUsersInfo,
}) => {
    const [form] = Form.useForm();

    /*  Destroy initialValues of form after Modal is closed */
    useEffect(() => {
        if (!visible) return;
        form.resetFields();
    }, [visible, form]);

    const updateUser = (data) => {
        return new ClientApi().UpdateUser(data);
    };
    const currentAppLocale = AppLocale[locale];
    const onFinish = (values) => {
        const key = "updatable";
        message.loading({
            content: (
                <IntlProvider
                    locale={currentAppLocale.locale}
                    messages={currentAppLocale.messages}
                >
                    <IntlMessage id={"message.AccountSettings.Updating"} />
                </IntlProvider>
            ),
            key,
        });
        setTimeout(async () => {
            updateUser({ User: { ...data, ...values } }).then((data: any) => {
                if (data) {
                    if (data.ErrorCode === 0) {
                        message.success({ content: DONE, key: "updatable" });
                        getUsersInfo();
                    } else {
                        message.error({
                            content: data.ErrorMessage,
                            key: "updatable",
                        });
                    }
                }
            });
        }, 1000);
    };
    const onFinishFailed = () => {};

    return (
        <Modal
            destroyOnClose
            title={"Edit user"}
            visible={visible}
            okText={<IntlMessage id={"account.EditProfile.SaveChange"} />}
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        onCancel();
                        onFinish(values);
                    })
                    .catch((info) => {
                        console.log("Validate Failed:", info);
                    });
            }}
        >
            <Form
                form={form}
                name="basicInformation"
                layout="vertical"
                initialValues={data}
            >
                <Row gutter={ROW_GUTTER}>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={
                                <IntlMessage
                                    id={"account.EditProfile.FirstName"}
                                />
                            }
                            name="FirstName"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your first name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={
                                <IntlMessage
                                    id={"account.EditProfile.LastName"}
                                />
                            }
                            name="LastName"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your last name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={
                                <IntlMessage id={"account.EditProfile.Email"} />
                            }
                            name="Email"
                            rules={[
                                {
                                    required: true,
                                    type: "email",
                                    message: "Please enter a valid email!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={
                                <IntlMessage
                                    id={"account.EditProfile.PhoneNumber"}
                                />
                            }
                            name="PhoneNumber"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
