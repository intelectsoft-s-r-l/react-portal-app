import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { LockOutlined, MailOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Form, Input, Alert, Tooltip, Radio } from "antd";
import {
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  authenticated,
  hideLoading, registerCompany,
} from "../../../redux/actions/Auth";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import JwtAuthService from "../../../services/JwtAuthService";
import axios from "axios";
import DocumentEvents from "react-document-events";
import Utils  from "../../../utils";
import {API_PUBLIC_KEY} from "../../../constants/ApiConstant";

const rules = {
  CommercialName: [
    {
      required: true,
      message: "Please input your commercial name",
    },
  ],
  JuridicalName: [
    {
      required: true,
      message: "Please input your juridical name",
    },
  ],
  IDNO: [
    {
      required: true,
      message: "Please input your IDNO",
    },
  ],
  JuridicalAddress: [
    {
      required: true,
      message: "Please input your juridical address",
    },
  ],
  OfficeAddress: [
    {
      required: true,
      message: "Please input your office address",
    },
  ],
  Bank: [
    {
      required: true,
      message: "Please input your bank",
    },
  ],
  IBAN: [
    {
      required: true,
      message: "Please input your IBAN",
    },
  ],
  BIC: [
    {
      required: true,
      message: "Please input your IBAN",
    },
  ],
  VATCode: [
    {
      required: true,
      message: "Please input your VAT code",
    },
  ],
  email: [
    {
      required: true,
      message: "Please input your email",
    },
    {
      type: "email",
      message: "Please enter a validate email!",
    },
  ],
  password: [
    {
      required: true,
      message: "Please input your password",
    },
    {
      min: 8,
      message: "Password must be minimum 8 characters",
    },
  ],
  confirm: [
    {
      required: true,
      message: "Please confirm your password!",
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject("Passwords do not match!");
      },
    }),
  ],
} as { [key: string]: any };

export const RegisterForm = (props) => {
  const {
    showLoading,
    token,
    loading,
    redirect,
    message,
    showMessage,
    hideAuthMessage,
    authenticated,
    allowRedirect,
    hideLoading,
    registerCompany
  } = props;
  const [form] = Form.useForm();

  const [isCapsLock, setIsCapsLock] = useState<boolean>();
  const [isVATPayer, setIsVATPayer] = useState<boolean>(false);

  const handlePasswordKeyPress = (event) => {
    if (event.getModifierState("CapsLock") && !isCapsLock) {
      setIsCapsLock(true);
    }
  };

  const handleDocumentKeyDown = (event) => {
    if (event.key === "CapsLock" && !event.ctrlKey && isCapsLock) {
      setIsCapsLock(false);
    }
  };
  const onSignUp = () => {
    form
      .validateFields()
      .then((values) => {
        const newCompanyData = {
          Company: {
            BIC: values.BIC,
            Bank: values.Bank,
            CommercialName: values.CommercialName,
            CountryID: 1,
            IBAN: values.IBAN,
            IDNO: values.IDNO,
            IsVATPayer: isVATPayer,
            JuridicalAddress: values.JuridicalAddress,
            JuridicalName: values.JuridicalName,
            Logo: '',
            OfficeAddress: values.OfficeAddress,
            VATCode: isVATPayer ? values.VATCode : "",
          },
          UsrEmail: values.email,
          UsrPassword: Utils.encryptInput(values.password, API_PUBLIC_KEY)
        }
        showLoading();
        setTimeout(() => {
          registerCompany(newCompanyData);
        }, 1500);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  useEffect(() => {
    // if (token !== null && allowRedirect) {
    //   history.push(redirect);
    // }
    if (showMessage) {
      setTimeout(() => {
        hideAuthMessage();
      }, 3000);
    }
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
        }}
      >
        <Alert type="error" showIcon message={message} />
      </motion.div>
      <Form
        form={form}
        layout="vertical"
        name="register-form"
        onFinish={onSignUp}
      >
        <Form.Item
          name="CommercialName"
          label="Commercial Name"
          rules={rules.CommercialName}
          hasFeedback
        >
          <Input prefix={<MailOutlined className={"text-primary"} />} />
        </Form.Item>
        <Form.Item
          name="JuridicalName"
          label="Juridical Name"
          rules={rules.JuridicalName}
          hasFeedback
        >
          <Input prefix={<MailOutlined className={"text-primary"} />} />
        </Form.Item>
        <Form.Item name="IDNO" label="IDNO" rules={rules.IDNO} hasFeedback>
          <Input prefix={<MailOutlined className={"text-primary"} />} />
        </Form.Item>
        <Form.Item
          name="JuridicalAddress"
          label="Juridical Address"
          rules={rules.JuridicalAddress}
          hasFeedback
        >
          <Input prefix={<MailOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item
          name="OfficeAddress"
          label="Office Address"
          rules={rules.OfficeAddress}
          hasFeedback
        >
          <Input prefix={<MailOutlined className={"text-primary"} />} />
        </Form.Item>
        <Form.Item name="Bank" label="Bank" rules={rules.Bank} hasFeedback>
          <Input prefix={<MailOutlined className={"text-primary"} />} />
        </Form.Item>
        <Form.Item name="IBAN" label="IBAN" rules={rules.IBAN} hasFeedback>
          <Input prefix={<MailOutlined className={"text-primary"} />} />
        </Form.Item>
        <Form.Item name="BIC" label="BIC" rules={rules.BIC} hasFeedback>
          <Input prefix={<MailOutlined className={"text-primary"} />} />
        </Form.Item>
        <Form.Item>
          <Radio.Group
            defaultValue={false}
            onChange={() => setIsVATPayer(!isVATPayer)}
          >
            <Radio.Button value={false}>Not a VAT Payer</Radio.Button>
            <Radio.Button value={true}>VAT Payer</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <motion.div initial={{
          display: "none",
          opacity: 0,
        }} animate={{
          display: isVATPayer ? "block" : "none",
          opacity: isVATPayer ? 1 : 0
        }}>
          <Form.Item
            name="VATCode"
            label="VAT Code"
            rules={[{
              required: isVATPayer,
              message: "Please insert your VAT Code"
            }

            ]}
            hasFeedback
          >
            <Input prefix={<MailOutlined className={"text-primary"} />} />
          </Form.Item>
        </motion.div>

        <Form.Item name="email" label="Email" rules={rules.email} hasFeedback>
          <Input prefix={<MailOutlined className={"text-primary"} />} />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
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
              onKeyPress: handlePasswordKeyPress,
            }}
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
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
              onKeyPress: handlePasswordKeyPress,
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign Up
          </Button>
        </Form.Item>
        <DocumentEvents onKeyDown={handleDocumentKeyDown} />
      </Form>
    </>
  );
};

const mapStateToProps = ({ auth }) => {
  const { loading, message, showMessage, token, redirect } = auth;
  return { loading, message, showMessage, token, redirect };
};

const mapDispatchToProps = {
  showAuthMessage,
  hideAuthMessage,
  showLoading,
  authenticated,
  hideLoading,
  registerCompany
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
