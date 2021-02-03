import React from "react";
import { Form, Button, Input, Row, Col, message } from "antd";
import IntlMessage from "../../../components/util-components/IntlMessage";
import { connect } from "react-redux";
import Utils from "../../../utils";
import { API_PUBLIC_KEY } from "../../../constants/ApiConstant";
import { AuthService } from "../../../api/HttpClient";
import { DONE } from "../../../constants/Messages";
import { IState } from "../../../redux/reducers";
import { IAuth } from "../../../redux/reducers/Auth";
import { ITheme } from "../../../redux/reducers/Theme";
import TranslateText from "../../../utils/translate";
import { FormInstance } from "antd/lib/form";

type onFinish = {
  currentPassword: string;
  newPassword: string;
};
export class ChangePassword extends React.Component {
  state = { loading: false };
  private formRef = React.createRef<FormInstance>();
  private onFinish = async ({ currentPassword, newPassword }: onFinish) => {
    this.setState({ loading: true });
    return await new AuthService()
      .ChangePassword(
        Utils.encryptInput(newPassword, API_PUBLIC_KEY),
        Utils.encryptInput(currentPassword, API_PUBLIC_KEY)
      )
      .then((data) => {
        this.setState({ loading: false });
        if (data && data.ErrorCode === 0) {
          this.formRef.current!.resetFields();
          message.success({
            content: TranslateText(DONE),
            key: "updatable",
          });
        }
      });
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
              onFinish={this.onFinish}
              ref={this.formRef}
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
