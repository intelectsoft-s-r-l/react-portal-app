import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { LockOutlined, MailOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Form, Input, Alert, Tooltip, Radio, Select } from "antd";
import {
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  hideLoading,
} from "../../../redux/actions/Auth";
import { motion } from "framer-motion";
import Utils from "../../../utils";
import { API_PUBLIC_KEY } from "../../../constants/ApiConstant";
import IntlMessage from "../../../components/util-components/IntlMessage";
import { AuthService } from "../../../api/auth";
import { IState } from "../../../redux/reducers";
import { IAuth } from "../../../redux/reducers/Auth";
import { ITheme } from "../../../redux/reducers/Theme";
import { RouteComponentProps } from "react-router-dom";

const rules = {
  JuridicalName: [
    {
      required: true,
      message: <IntlMessage id={"auth.MessageInsertJuridicalName"} />,
    },
  ],
  IDNO: [
    {
      required: true,
      message: <IntlMessage id={"auth.MessageInsertIDNO"} />,
    },
    {
      pattern: /^(\d{13})?$/,
      message: <IntlMessage id={"auth.IDNOValidation"} />,
    },
  ],
  VATCode: [
    {
      required: true,
      message: <IntlMessage id={"auth.MessageInsertVATCode"} />,
    },
  ],
  email: [
    {
      required: true,
      message: <IntlMessage id={"auth.MessageInsertEmail"} />,
    },
    {
      type: "email",
      message: <IntlMessage id={"auth.MessageInsertValidEmail"} />,
    },
  ],
  password: [
    {
      required: true,
      message: <IntlMessage id={"auth.MessageInsertPassword"} />,
    },
    {
      required: true,
      pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+,.\\\/;':"-]).{8,}$/,
      message: <IntlMessage id={"auth.PasswordValidation"} />,
    },
  ],
  confirm: [
    {
      required: true,
      message: <IntlMessage id={"auth.MessageInsertConfirmPassword"} />,
    },
    ({ getFieldValue }: any) => ({
      validator(rule: any, value: any) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(
          <IntlMessage id={"auth.MessagePasswordsMatch"} />
        );
      },
    }),
  ],
} as { [key: string]: any };

interface IRegisterFormProps extends ITheme, RouteComponentProps, IAuth {
  showLoading: () => void;
  hideAuthMessage: () => void;
  hideLoading: () => void;
}
export const RegisterForm = (props: IRegisterFormProps) => {
  const {
    showLoading,
    loading,
    showMessage,
    hideAuthMessage,
    hideLoading,
    locale,
    history,
  } = props;
  const [form] = Form.useForm();

  const [isCapsLock, setIsCapsLock] = useState<boolean>(false);
  const [isVATPayer, setIsVATPayer] = useState<boolean>(false);

  const onSignUp = () => {
    form
      .validateFields()
      .then((values) => {
        const newCompanyData = {
          IDNO: values.IDNO,
          JuridicalName: values.JuridicalName,
          UiLanguage: locale === "ro" ? 0 : locale === "ru" ? 1 : 2,
          VATCode: isVATPayer ? values.VATCode : "",
          UsrEmail: values.email,
          UsrPassword: Utils.encryptInput(values.password, API_PUBLIC_KEY),
        };
        showLoading();
        setTimeout(async () => {
          hideLoading();
          return new AuthService()
            .RegisterCompany({ ...newCompanyData })
            .then((data) => {
              /* 108 is a positive errorcode in this case */
              if (data.ErrorCode === 108) {
                history.push("/auth/confirm");
              }
              // Else ErrorCode >= 135 send message to admin / show internal error
            });
        }, 1500);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        hideAuthMessage();
      }, 3000);
    }
  }, [showMessage]);

  const { Option } = Select;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
        }}
      >
        <Alert type="error" showIcon message={props.message} />
      </motion.div>
      <Form
        form={form}
        layout="vertical"
        name="register-form"
        onFinish={onSignUp}
      >
        <Form.Item
          name="JuridicalName"
          label={<IntlMessage id={"auth.JuridicalName"} />}
          rules={rules.JuridicalName}
          hasFeedback
        >
          <Input prefix={<MailOutlined className={"text-primary"} />} />
        </Form.Item>
        <Form.Item
          name="IDNO"
          label={<IntlMessage id={"auth.IDNO"} />}
          rules={rules.IDNO}
          hasFeedback
        >
          <Input prefix={<MailOutlined className={"text-primary"} />} />
        </Form.Item>

        <Form.Item>
          <Radio.Group
            defaultValue={false}
            onChange={() => setIsVATPayer(!isVATPayer)}
          >
            <Radio.Button value={false}>
              {<IntlMessage id={"auth.NotVATPayer"} />}
            </Radio.Button>
            <Radio.Button value={true}>
              {<IntlMessage id={"auth.VATPayer"} />}
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <motion.div
          initial={{
            display: "none",
            opacity: 0,
          }}
          animate={{
            display: isVATPayer ? "block" : "none",
            opacity: isVATPayer ? 1 : 0,
          }}
        >
          <Form.Item
            name="VATCode"
            label={<IntlMessage id={"auth.VATCode"} />}
            rules={[
              {
                required: isVATPayer,
                message: <IntlMessage id={"auth.MessageInsertVATCode"} />,
              },
            ]}
            hasFeedback
          >
            <Input prefix={<MailOutlined className={"text-primary"} />} />
          </Form.Item>
        </motion.div>
        <Form.Item
          name="email"
          label={<IntlMessage id={"auth.Email"} />}
          rules={rules.email}
          hasFeedback
        >
          <Input prefix={<MailOutlined className={"text-primary"} />} />
        </Form.Item>
        <Form.Item
          name="password"
          label={<IntlMessage id={"auth.Password"} />}
          rules={rules.password}
          hasFeedback
        >
          <Input.Password
            {...{
              mode: "multiple",
              prefix: [
                <LockOutlined className={"text-primary"} />,
                isCapsLock && (
                  <Tooltip title={"CapsLock is on"}>
                    <WarningOutlined className={"text-danger ml-1"} />
                  </Tooltip>
                ),
              ],
              type: "password",
            }}
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          label={<IntlMessage id={"auth.ConfirmPassword"} />}
          rules={rules.confirm}
          hasFeedback
        >
          <Input
            {...{
              prefix: [
                <LockOutlined className={"text-primary"} />,
                isCapsLock && (
                  <Tooltip title={"CapsLock is on"}>
                    <WarningOutlined className={"text-danger ml-1"} />
                  </Tooltip>
                ),
              ],
              type: "password",
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {" "}
            {<IntlMessage id={"auth.SignUp"} />}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

const mapStateToProps = ({ auth, theme }: IState) => {
  const { loading, message, showMessage } = auth as IAuth;
  const { locale } = theme as ITheme;
  return { loading, message, showMessage, locale };
};

const mapDispatchToProps = {
  showAuthMessage,
  hideAuthMessage,
  showLoading,
  hideLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
