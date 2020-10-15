import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { LockOutlined, MailOutlined, WarningOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Alert,
  Tooltip,
  Radio,
  Row,
  Col,
  Select,
} from "antd";
import {
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  authenticated,
  hideLoading,
  registerCompany,
} from "../../../redux/actions/Auth";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import JwtAuthService from "../../../services/JwtAuthService";
import axios from "axios";
import DocumentEvents from "react-document-events";
import Utils from "../../../utils";
import { API_PUBLIC_KEY } from "../../../constants/ApiConstant";
import IntlMessage from "../../../components/util-components/IntlMessage";

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
      min: 8,
      message: <IntlMessage id={"auth.MessageInsertValidPassword"} />,
    },
  ],
  confirm: [
    {
      required: true,
      message: <IntlMessage id={"auth.MessageInsertConfirmPassword"} />,
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
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
    registerCompany,
    locale,
    history,
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
        /*        const oldCompanyData = {
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
            Logo: "",
            OfficeAddress: values.OfficeAddress,
            VATCode: isVATPayer ? values.VATCode : "",
          },
          UsrEmail: values.email,
          UsrPassword: Utils.encryptInput(values.password, API_PUBLIC_KEY),
        };*/
        const newCompanyData = {
          IDNO: values.IDNO,
          JuridicalName: values.JuridicalName,
          UiLanguage: locale === "ro" ? 0 : locale === "ru" ? 1 : 2,
          VATCode: isVATPayer ? values.VATCode : "",
          UsrEmail: values.email,
          UsrPassword: Utils.encryptInput(values.password, API_PUBLIC_KEY),
        } as { [key: string]: any };
        showLoading();
        setTimeout(() => {
          registerCompany(newCompanyData, history, <IntlMessage id={"auth.MessageRedirect"}/>);
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
        <Alert type="error" showIcon message={message} />
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
        <Form.Item name="IDNO" label={<IntlMessage id={"auth.IDNO"} />} rules={rules.IDNO} hasFeedback>
          <Input prefix={<MailOutlined className={"text-primary"} />} />
        </Form.Item>

        <Form.Item>
          <Radio.Group
            defaultValue={false}
            onChange={() => setIsVATPayer(!isVATPayer)}
          >
            <Radio.Button value={false}>{<IntlMessage id={"auth.NotVATPayer"} />}</Radio.Button>
            <Radio.Button value={true}>{<IntlMessage id={"auth.VATPayer"} />}</Radio.Button>
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
        <Form.Item name="email" label={<IntlMessage id={"auth.Email"} />} rules={rules.email} hasFeedback>
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
              onKeyPress: handlePasswordKeyPress,
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
              onKeyPress: handlePasswordKeyPress,
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {" "}{<IntlMessage id={"auth.SignUp"} />}
          </Button>
        </Form.Item>
        <DocumentEvents onKeyDown={handleDocumentKeyDown} />
      </Form>
    </>
  );
};

const mapStateToProps = ({ auth, theme }) => {
  const { loading, message, showMessage, token, redirect } = auth;
  const { locale } = theme;
  return { loading, message, showMessage, token, redirect, locale };
};

const mapDispatchToProps = {
  showAuthMessage,
  hideAuthMessage,
  showLoading,
  authenticated,
  hideLoading,
  registerCompany,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);

{
  /*
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
</Form>*/
}

/* 2 COLUMNS LAYOUT */

{
  /*
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
  <Row gutter={40}>
  <Col xs={24} sm={24} md={50} lg={50} xl={12}>
  <Form.Item
name="CommercialName"
label="Commercial Name"
rules={rules.CommercialName}
hasFeedback
>
<Input prefix={<MailOutlined className={"text-primary"} />} />
</Form.Item>
</Col>
<Col xs={24} sm={24} md={50} lg={50} xl={12}>
<Form.Item
name="JuridicalName"
label="Juridical Name"
rules={rules.JuridicalName}
hasFeedback
>
<Input prefix={<MailOutlined className={"text-primary"} />} />
</Form.Item>
</Col>
</Row>
<Row gutter={40}>
<Col xs={24} sm={24} md={50} lg={50} xl={12}>
<Form.Item name="IDNO" label="IDNO" rules={rules.IDNO} hasFeedback>
<Input prefix={<MailOutlined className={"text-primary"} />} />
</Form.Item>
</Col>
<Col xs={24} sm={24} md={50} lg={50} xl={12}>
<Form.Item
name="JuridicalAddress"
label="Juridical Address"
rules={rules.JuridicalAddress}
hasFeedback
>
<Input prefix={<MailOutlined className="text-primary" />} />
</Form.Item>
</Col>
</Row>
<Row gutter={40}>
<Col xs={24} sm={24} md={50} lg={50} xl={12}>
<Form.Item
name="OfficeAddress"
label="Office Address"
rules={rules.OfficeAddress}
hasFeedback
>
<Input prefix={<MailOutlined className={"text-primary"} />} />
</Form.Item>
</Col>
<Col xs={24} sm={24} md={50} lg={50} xl={12}>
<Form.Item name="Bank" label="Bank" rules={rules.Bank} hasFeedback>
<Input prefix={<MailOutlined className={"text-primary"} />} />
</Form.Item>
</Col>
</Row>
<Row gutter={40}>
<Col xs={24} sm={24} md={50} lg={50} xl={12}>
<Form.Item name="IBAN" label="IBAN" rules={rules.IBAN} hasFeedback>
<Input prefix={<MailOutlined className={"text-primary"} />} />
</Form.Item>
</Col>
<Col xs={24} sm={24} md={50} lg={50} xl={12}>
<Form.Item name="BIC" label="BIC" rules={rules.BIC} hasFeedback>
<Input prefix={<MailOutlined className={"text-primary"} />} />
</Form.Item>
</Col>
</Row>
<Row gutter={40}>
<Col xs={24} sm={24} md={50} lg={50} xl={12}>
<Form.Item
name="email"
label="Email"
rules={rules.email}
hasFeedback
>
<Input prefix={<MailOutlined className={"text-primary"} />} />
</Form.Item>
</Col>
<Col xs={24} sm={24} md={50} lg={50} xl={12}>
<Form.Item>
<Radio.Group
defaultValue={false}
onChange={() => setIsVATPayer(!isVATPayer)}
>
<Radio.Button value={false}>Not a VAT Payer</Radio.Button>
<Radio.Button value={true}>VAT Payer</Radio.Button>
</Radio.Group>
</Form.Item>
</Col>
</Row>
<Row gutter={40}>
<Col xs={24} sm={24} md={50} lg={50} xl={12}>
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
</Col>
<Col xs={24} sm={24} md={50} lg={50} xl={12}>
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
label="VAT Code"
rules={[
{
required: isVATPayer,
message: "Please insert your VAT Code",
},
]}
hasFeedback
>
<Input prefix={<MailOutlined className={"text-primary"} />} />
</Form.Item>
</motion.div>
</Col>
</Row>
<Row gutter={40}>
<Col xs={24} sm={24} md={50} lg={50} xl={12}>
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
</Col>
</Row>
<Form.Item>
<Button type="primary" htmlType="submit" block loading={loading}>
Sign Up
</Button>
</Form.Item>
<DocumentEvents onKeyDown={handleDocumentKeyDown} />
</Form>*/
}
