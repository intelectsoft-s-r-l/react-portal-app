import React, { Component } from "react";
import { Form, Avatar, Button, Input, Row, Col, message, Upload } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import Flex from "../../../components/shared-components/Flex";
import { setProfileInfo } from "../../../redux/actions/Account";
import { connect } from "react-redux";
import MaskedInput from "antd-mask-input/build/main/lib/MaskedInput";
import Utils from "../../../utils";
import Localization from "../../../utils/Localization";
import {
    DONE,
    UPDATING,
    UPLOADED,
    UPLOADING,
} from "../../../constants/Messages";
import IntlMessage from "../../../components/util-components/IntlMessage";
import { IState } from "../../../redux/reducers";
import { IAccount } from "../../../redux/reducers/Account";
import { ITheme } from "../../../redux/reducers/Theme";
import { IAuth } from "../../../redux/reducers/Auth";

class EditProfile extends Component {
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
            token,
            onChangeMask,
        } = this.props as any;

        const onFinish = (values: any) => {
            const key = "updatable";
            message.loading({
                content: <Localization msg={UPDATING} />,
                key,
            });
            setTimeout(async () => {
                setProfileInfo({
                    Token: token,
                    User: {
                        ...account,
                        ...values,
                    },
                });
                message.success({
                    content: <Localization msg={DONE} />,
                    key,
                    duration: 2,
                });
            }, 1000);
        };

        const onFinishFailed = (errorInfo: any) => {
            console.log("Failed:", errorInfo);
        };

        const onUploadAavater = (info: any) => {
            const key = "updatable";
            if (info.file.status === "uploading") {
                message.loading({
                    content: <Localization msg={UPLOADING} />,
                    key,
                    duration: 2,
                });
                return;
            }
            if (info.file.status === "done") {
                Utils.getBase64(info.file.originFileObj, (imageUrl: any) => {
                    setProfileInfo({
                        Token: token,
                        User: { ...account, Photo: imageUrl },
                    });
                });
                message.success({
                    content: <Localization msg={UPLOADED} />,
                    key,
                    duration: 2,
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
                            customRequest={Utils.dummyRequest}
                            beforeUpload={(info) => Utils.beforeUpload(info)}
                        >
                            <Button type="primary">
                                <IntlMessage
                                    id={"account.EditProfile.ChangeAvatar"}
                                />
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
                                                <IntlMessage
                                                    id={
                                                        "account.EditProfile.FirstName"
                                                    }
                                                />
                                            }
                                            name="FirstName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your first name!",
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
                                                    id={
                                                        "account.EditProfile.LastName"
                                                    }
                                                />
                                            }
                                            name="LastName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your last name!",
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
                                                    id={
                                                        "account.EditProfile.Email"
                                                    }
                                                />
                                            }
                                            name="Email"
                                            rules={[
                                                {
                                                    required: true,
                                                    type: "email",
                                                    message:
                                                        "Please enter a valid email!",
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
                                                    id={
                                                        "account.EditProfile.PhoneNumber"
                                                    }
                                                />
                                            }
                                            name="PhoneNumber"
                                        >
                                            <MaskedInput
                                                mask="+(111) 111 111 11"
                                                onChange={onChangeMask}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Button type="primary" htmlType="submit">
                                    <IntlMessage
                                        id={"account.EditProfile.SaveChange"}
                                    />
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
    const { token } = auth as IAuth;
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
