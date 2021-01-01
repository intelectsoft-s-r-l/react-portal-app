import React, { Component } from "react";
import { Form, Button, Input, Row, Col, message } from "antd";
import IntlMessage from "../../../components/util-components/IntlMessage";
import { connect } from "react-redux";
import Utils from "../../../utils";
import { API_PUBLIC_KEY } from "../../../constants/ApiConstant";
import AppLocale from "../../../lang";
import { AuthService } from "../../../api";
import { DONE } from "../../../constants/Messages";
import Localization from "../../../utils/Localization";
import { IState } from "../../../redux/reducers";
import { IAuth } from "../../../redux/reducers/Auth";
import { ITheme } from "../../../redux/reducers/Theme";

export class ChangePassword extends Component {
  private changePasswordFormRef = React.createRef<any>();
  state = {
    loading: false,
  };

  onFinish = ({ currentPassword, newPassword }: { [key: string]: string }) => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      return new AuthService()
        .ChangePassword({
          NewPassword: Utils.encryptInput(newPassword, API_PUBLIC_KEY),
          OldPassword: Utils.encryptInput(currentPassword, API_PUBLIC_KEY),
        })
        .then((data: any) => {
          if (data) {
            if (data.ErrorCode === 0)
              message.success({
                content: <Localization msg={DONE} />,
                key: "updatable",
              });
          }
        });
    }, 1500);
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
                  {
                    required: true,
                    pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+,.\\\/;':"-]).{8,}$/,
                    message:
                      "Password should contain at least 8 characters, 1 capital letter and 1 special symbol!",
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
              <Button
                type="primary"
                htmlType="submit"
                loading={this.state.loading}
              >
                {" "}
                <IntlMessage id={"account.ChangePassword.ChangePassword"} />
              </Button>
            </Form>
          </Col>
        </Row>
      </>
    );
  }
}

const mapStateToProps = ({ auth, theme }: IState) => {
  const { token } = auth as IAuth;
  const { locale } = theme as ITheme;
  return { token, locale };
};
export default connect(mapStateToProps, null)(ChangePassword);
