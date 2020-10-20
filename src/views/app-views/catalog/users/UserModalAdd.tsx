import { Row, Col, Input, Modal, Form, message } from "antd";
import React, { useState } from "react";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { API_IS_AUTH_SERVICE } from "../../../../constants/ApiConstant";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import axios from "axios";
export const UserModalAdd = ({
  onCreate,
  onCancel,
  visible,
  token: Token,
  CompanyID,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    axios
      .post(`${API_IS_AUTH_SERVICE}/RegisterUser`, {
        /* Get the companyID, token and uilanguage from redux store */
        ...values,
        CompanyID,
        Token,
        UiLanguage: 0,
      })
      .then((res) => {
        console.log(res.data);
        form.resetFields();
        if (res.data.ErrorCode === 0) {
          message.success(
            "You've successfully registered a new user. Check your email! :)",
            2
          );
        } else {
          message.error(res.data.ErrorMessage);
        }
      });
  };
  return (
    <Modal
      title={"Register user"}
      visible={visible}
      okText={<IntlMessage id={"account.EditProfile.SaveChange"} />}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          form
            .validateFields()
            .then((values) => {
              onCancel();
              onFinish(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }, 1000);
      }}
    >
      <Form form={form} name="basicInformation" layout="vertical">
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={<IntlMessage id={"account.EditProfile.FirstName"} />}
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
              label={<IntlMessage id={"account.EditProfile.LastName"} />}
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
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label={<IntlMessage id={"account.EditProfile.Email"} />}
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
        </Row>
      </Form>
    </Modal>
  );
};
