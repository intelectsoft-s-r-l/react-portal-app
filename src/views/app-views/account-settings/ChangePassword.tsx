import React, { Component } from "react";
import { Form, Button, Input, Row, Col, message } from "antd";
import IntlMessage from "../../../components/util-components/IntlMessage";

export class ChangePassword extends Component {
  private changePasswordFormRef = React.createRef<any>();

  onFinish = () => {
    message.success({ content: "Password Changed!", duration: 2 });
    this.onReset();
  };

  onReset = () => {
    this.changePasswordFormRef.current!.resetFields();
  };

  render() {
    return (
      <>
        <h2 className="mb-4">
          <IntlMessage id={"account.ChangePassword.Title"} />
        </h2>
        <Row>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Form
              name="changePasswordForm"
              layout="vertical"
              ref={this.changePasswordFormRef}
              onFinish={this.onFinish}
            >
              <Form.Item
                label={
                  <IntlMessage id={"account.ChangePassword.CurrentPassword"} />
                }
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter your currrent password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label={
                  <IntlMessage id={"account.ChangePassword.NewPassword"} />
                }
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter your new password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label={
                  <IntlMessage id={"account.ChangePassword.ConfirmPassword"} />
                }
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Password not matched!");
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                <IntlMessage id={"account.ChangePassword.ChangePassword"} />
              </Button>
            </Form>
          </Col>
        </Row>
      </>
    );
  }
}

export default ChangePassword;
