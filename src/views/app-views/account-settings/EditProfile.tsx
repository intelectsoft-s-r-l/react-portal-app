import React, { Component } from "react";
import { Form, Avatar, Button, Input, Row, Col, Upload, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import Flex from "../../../components/shared-components/Flex";
import { setProfileInfo } from "../../../redux/actions/Account";
import { connect } from "react-redux";
import MaskedInput from "antd-mask-input/build/main/lib/MaskedInput";
import Utils from "../../../utils";
import IntlMessage from "../../../components/util-components/IntlMessage";
import { IState } from "../../../redux/reducers";
import { IAccount } from "../../../redux/reducers/Account";
import { ITheme } from "../../../redux/reducers/Theme";
import { IAuth } from "../../../redux/reducers/Auth";
import { UPLOADING } from "../../../constants/Messages";
import TranslateText from "../../../utils/translate";

interface IEditProfile {
  setProfileInfo: (accountInfo: { User: IAccount }) => void;
  locale?: string;
  CompanyID?: number;
  ID?: number;
  loading?: boolean;
  account?: IAccount;
  Email?: string;
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string;
  Photo?: string;
}
class EditProfile extends Component<IEditProfile> {
  state = {};
  onChangeMask = (e: any) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onFinish = (values: any) => {
    message.loading({ content: TranslateText(UPLOADING), key: "updatable" });
    this.props.setProfileInfo({
      User: {
        ...this.props.account,
        ...values,
      },
    });
  };
  onUploadAvatar = (info: any) => {
    if (info.file.status === "uploading") {
      message.loading({
        content: TranslateText(UPLOADING),
        key: "updatable",
      });
    }
    if (info.file.status === "done") {
      Utils.getBase64(info.file.originFileObj, (imageUrl: string) => {
        this.props.setProfileInfo({
          User: { ...this.props.account, Photo: imageUrl },
        });
      });
    }
  };
  onRemoveAvatar = () => {
    setProfileInfo({
      User: { ...this.props.account, Photo: "" },
    });
  };
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
      setProfileInfo,
    } = this.props;

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
              onChange={this.onUploadAvatar}
              showUploadList={false}
              customRequest={Utils.dummyRequest}
              beforeUpload={(info) => Utils.beforeUpload(info)}
            >
              <Button type="primary">
                <IntlMessage id={"account.EditProfile.ChangeAvatar"} />
              </Button>
            </Upload>
            <Button className="ml-2" onClick={this.onRemoveAvatar}>
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
            onFinish={this.onFinish}
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
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={
                        <IntlMessage id={"account.EditProfile.PhoneNumber"} />
                      }
                      name="PhoneNumber"
                    >
                      <MaskedInput
                        mask="+(111) 111 111 11"
                        onChange={this.onChangeMask}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Button type="primary" htmlType="submit">
                  {" "}
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
  setProfileInfo,
};

const mapStateToProps = ({ account, theme, auth }: IState) => {
  const {
    CompanyID,
    Email,
    FirstName,
    ID,
    LastName,
    PhoneNumber,
    Photo,
  } = account as IAccount;
  const { locale } = theme as ITheme;
  const { token, loading } = auth as IAuth;
  return {
    loading,
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
