import React, { Component } from "react";
import {
  Form,
  Avatar,
  Button,
  Input,
  DatePicker,
  Row,
  Col,
  message,
  Upload,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import Flex from "../../../components/shared-components/Flex";
import IntlMessage from "../../../components/util-components/IntlMessage";
import {
  updateSettings,
  removeAvatar,
  setProfileInfo,
} from "../../../redux/actions/Account";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import AppLocale from "../../../lang";
import axios from "axios";
import { API_IS_CLIENT_SERVICE } from "../../../constants/ApiConstant";

interface EditProfileProps {
  CompanyID: number;
  Email: string;
  FirstName: string;
  ID: number;
  LastName: string;
  Password: string;
  PhoneNumber: string;
  Photo: any;
  Token: string;
  UiLanguage: number;
  locale: string;
  account: {};
  token: string;
  updateSettings: any;
  setProfileInfo: any;
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

class EditProfile extends Component<EditProfileProps> {
  avatarEndpoint = "https://www.mocky.io/v2/5cc8019d300000980a055e76";

  // state = {
  // 	avatarUrl: store.getState().account.avatar,
  // 	name: store.getState().account.name,
  // 	email: store.getState().account.email,
  // 	userName: store.getState().account.userName,
  // 	dateOfBirth: null,
  // 	phoneNumber: store.getState().account.phoneNumber,
  // 	website: '',
  // 	address: '',
  // 	city: '',
  // 	postcode: ''
  // }

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  render() {
    let {
      account,
      CompanyID,
      Email,
      FirstName,
      ID,
      LastName,
      PhoneNumber,
      Photo,
      locale,
      updateSettings,
      setProfileInfo,
      token,
    } = this.props;

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
      setTimeout(() => {
        // console.log({ Token: token, User: { ...account, ...values } });
        setProfileInfo({ Token: token, User: { ...account, ...values } });
        message.success({
          content: (
            <IntlProvider
              locale={currentAppLocale.locale}
              messages={currentAppLocale.messages}
            >
              <IntlMessage id={"message.AccountSettings.Done"} />
            </IntlProvider>
          ),
          key,
          duration: 2,
        });
      }, 1000);
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    const onUploadAavater = (info) => {
      const key = "updatable";
      if (info.file.status === "uploading") {
        message.loading({
          content: (
            <IntlProvider
              locale={currentAppLocale.locale}
              messages={currentAppLocale.messages}
            >
              <IntlMessage id={"message.AccountSettings.Uploading"} />
            </IntlProvider>
          ),
          key,
          duration: 2,
        });
        return;
      }
      if (info.file.status === "done") {
        this.getBase64(info.file.originFileObj, (imageUrl) => {
          setProfileInfo({
            Token: token,
            User: { ...account, Photo: imageUrl },
          });
        });
        message.success({
          content: (
            <IntlProvider
              locale={currentAppLocale.locale}
              messages={currentAppLocale.messages}
            >
              <IntlMessage id={"message.AccountSettings.Uploaded"} />
            </IntlProvider>
          ),
          key,
          duration: 2,
        });
      } else {
        message.error({
          content: (
            <IntlProvider
              locale={currentAppLocale.locale}
              messages={currentAppLocale.messages}
            >
              <IntlMessage id={"message.AccountSettings.Error"} />
            </IntlProvider>
          ),
          key,
          duration: 2.5,
        });
      }
    };

    const onRemoveAvater = () => {
      setProfileInfo({
        Token: token,
        User: { ...account, Photo: "" },
      });
    };

    return (
      <>
        <Flex
          alignItems="center"
          mobileFlex={false}
          className="text-center text-md-left"
        >
          <Avatar size={90} src={Photo} icon={<UserOutlined />} />
          <div className="ml-md-3 mt-md-0 mt-3">
            <Upload
              onChange={onUploadAavater}
              showUploadList={false}
              action={this.avatarEndpoint}
              // beforeUpload={beforeUpload}
            >
              <Button type="primary">
                <IntlMessage id={"account.EditProfile.ChangeAvatar"} />
              </Button>
            </Upload>
            <Button className="ml-2" onClick={onRemoveAvater}>
              <IntlMessage id={"account.EditProfile.Remove"} />
            </Button>
          </div>
        </Flex>
        <div className="mt-4">
          <Form
            name="basicInformation"
            layout="vertical"
            initialValues={{
              CompanyID,
              Email,
              FirstName,
              ID,
              LastName,
              PhoneNumber,
              Photo,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row>
              <Col xs={24} sm={24} md={24} lg={16}>
                <Row gutter={ROW_GUTTER}>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={
                        <IntlMessage id={"account.EditProfile.FirstName"} />
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
                        <IntlMessage id={"account.EditProfile.LastName"} />
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
                  {/* <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={
                        <IntlMessage id={"account.EditProfile.DateOfBirth"} />
                      }
                      name="dateOfBirth"
                    >
                      <DatePicker className="w-100" />
                    </Form.Item>
                  </Col> */}
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={
                        <IntlMessage id={"account.EditProfile.PhoneNumber"} />
                      }
                      name="PhoneNumber"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Button type="primary" htmlType="submit">
                  <IntlMessage id={"account.EditProfile.SaveChange"} />
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = {
  updateSettings,
  removeAvatar,
  setProfileInfo,
};

const mapStateToProps = ({ account, theme, auth }) => {
  const {
    CompanyID,
    Email,
    FirstName,
    ID,
    LastName,
    PhoneNumber,
    Photo,
  } = account;
  const { locale } = theme;
  const { token } = auth;
  return {
    account,
    CompanyID,
    Email,
    FirstName,
    ID,
    LastName,
    PhoneNumber,
    Photo,
    locale,
    token,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
