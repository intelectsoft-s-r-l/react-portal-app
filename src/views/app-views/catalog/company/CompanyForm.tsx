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
import MaskedInput from "antd-mask-input";
import { UserOutlined } from "@ant-design/icons";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import Flex from "../../../../components/shared-components/Flex";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import {
    updateSettings,
    removeAvatar,
} from "../../../../redux/actions/Account";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import AppLocale from "../../../../lang";
import axios from "axios";
import { signOut } from "../../../../redux/actions/Auth";
import { API_APP_URL } from "../../../../configs/AppConfig";
const publicIp = require("react-public-ip");

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

class CompanyForm extends Component<{ [key: string]: any }> {
    avatarEndpoint = "https://www.mocky.io/v2/5cc8019d300000980a055e76";
    inputMaskRef = React.createRef() as any;
    state = {} as { [key: string]: any };
    formRef = React.createRef() as any;

    componentDidMount() {
        axios
            .get(`${API_APP_URL}/GetCompanyInfo`, {
                params: {
                    Token: this.props.token,
                },
            })
            .then((res) => {
                const { ErrorCode, ErrorMessage, Company } = res.data;
                if (ErrorCode === 0) {
                    console.log(Company);
                    this.setState(Company);
                    this.formRef["current"].setFieldsValue(Company);
                } else if (res.data.ErrorCode === 118) {
                    message.loading(
                        "Time has expired. Redirecting you to login page...",
                        2
                    );
                    setTimeout(() => {
                        this.props.signOut();
                    }, 2000);
                } else {
                    message.error(ErrorMessage);
                }
            })
            .catch((error) => {
                const key = "updatable";
                message.error({ content: error.toString(), key });
            });
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    // componentDidMount {
    //   getCompanyInfo(this.props.token)
    // }

    render() {
        let { updateSettings, removeAvatar, locale, signOut } = this.props;

        const currentAppLocale = AppLocale[locale];

        const onFinish = async (values) => {
            console.log(values);
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
            setTimeout(async () => {
                console.log({
                    Company: { ...this.state, ...values },
                    Token: this.props.token,
                    info: await publicIp.v4(),
                });
                axios
                    .post(`${API_APP_URL}/UpdateCompany`, {
                        Company: {
                            ...this.state,
                            ...values,
                        },
                        Token: this.props.token,
                        info: (await publicIp.v4()) || "",
                    })
                    .then((res) => {
                        console.log(res.data);
                        if (res.data.ErrorCode === 0) {
                            message.success({
                                content: (
                                    <IntlProvider
                                        locale={currentAppLocale.locale}
                                        messages={currentAppLocale.messages}
                                    >
                                        <IntlMessage
                                            id={"message.AccountSettings.Done"}
                                        />
                                    </IntlProvider>
                                ),
                                key,
                                duration: 2,
                            });
                        } else if (res.data.ErrorCode === 118) {
                            message.loading(
                                "Time has expired. Redirecting you to login page...",
                                1.5
                            );
                            setTimeout(() => {
                                signOut();
                            }, 1500);
                        } else {
                            message.error({
                                content: (
                                    <IntlProvider
                                        locale={currentAppLocale.locale}
                                        messages={currentAppLocale.messages}
                                    >
                                        <IntlMessage
                                            id={"message.AccountSettings.Error"}
                                        />
                                    </IntlProvider>
                                ),
                                key,
                                duration: 2,
                            });
                        }
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
                            <IntlMessage
                                id={"message.AccountSettings.Uploading"}
                            />
                        </IntlProvider>
                    ),
                    key,
                    duration: 2,
                });
                return;
            }
            if (info.file.status === "done") {
                this.getBase64(info.file.originFileObj, async (imageUrl) => {
                    axios
                        .post(`${API_APP_URL}/UpdateCompany`, {
                            Company: {
                                ...this.state,
                                Logo: imageUrl,
                            },
                            Token: this.props.token,
                            info: (await publicIp.v4()) || "",
                        })
                        .then((res) => {
                            console.log(res.data);
                            if (res.data.ErrorCode === 0) {
                                this.setState({ Logo: imageUrl });
                            } else if (res.data.ErrorCode === 118) {
                                message.loading(
                                    "Time has expired. Redirecting you to login page...",
                                    1.5
                                );
                                setTimeout(() => {
                                    signOut();
                                }, 1500);
                            }
                        });
                });
                message.success({
                    content: (
                        <IntlProvider
                            locale={currentAppLocale.locale}
                            messages={currentAppLocale.messages}
                        >
                            <IntlMessage
                                id={"message.AccountSettings.Uploaded"}
                            />
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

        const onRemoveAvater = async () => {
            axios
                .post(`${API_APP_URL}/UpdateCompany`, {
                    Company: {
                        ...this.state,
                        Logo: "",
                    },
                    Token: this.props.token,
                    info: (await publicIp.v4()) || "",
                })
                .then((res) => {
                    console.log(res.data);
                    if (res.data.ErrorCode === 0) {
                        this.setState({ Logo: "" });
                    } else if (res.data.ErrorCode === 118) {
                        message.loading(
                            "Time has expired. Redirecting you to login page...",
                            1.5
                        );
                        setTimeout(() => {
                            signOut();
                        }, 1500);
                    }
                });
        };

        return (
            <>
                <Flex
                    alignItems="center"
                    mobileFlex={false}
                    className="text-center text-md-left"
                >
                    <Avatar
                        size={90}
                        src={this.state.Logo}
                        icon={<UserOutlined />}
                    />
                    <div className="ml-md-3 mt-md-0 mt-3">
                        <Upload
                            onChange={onUploadAavater}
                            showUploadList={false}
                            action={this.avatarEndpoint}
                            // beforeUpload={beforeUpload}
                        >
                            <p style={{ marginBottom: "15px" }}>
                                * <i>JPEG, PNG. 150x150</i>
                            </p>
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
                        ref={this.formRef}
                        name="basicInformation"
                        layout="vertical"
                        initialValues={this.state}
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
                                                    id={"account.company.BIC"}
                                                />
                                            }
                                            name="BIC"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your BIC!",
                                                },
                                                // {
                                                //     pattern: /[A-Z]{4}-[A-Z]{2}-[0-9]{5}/,
                                                //     message:
                                                //         "Invalid BIC format",
                                                // },
                                            ]}
                                        >
                                            {/* <MaskedInput
                                                mask="AAAA-AA-11111"
                                                onChange={
                                                    this.props.onChangeMask
                                                }
                                            /> */}
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12}>
                                        <Form.Item
                                            label={
                                                <IntlMessage
                                                    id={"account.company.Bank"}
                                                />
                                            }
                                            name="Bank"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your bank!",
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
                                                        "account.company.CommercialName"
                                                    }
                                                />
                                            }
                                            name="CommercialName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your commercial name!",
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
                                                    id={"account.company.IBAN"}
                                                />
                                            }
                                            name="IBAN"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your IBAN!",
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
                                                    id={"account.company.IDNO"}
                                                />
                                            }
                                            name="IDNO"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: (
                                                        <IntlMessage
                                                            id={
                                                                "auth.MessageInsertIDNO"
                                                            }
                                                        />
                                                    ),
                                                },
                                                {
                                                    pattern: /^(\d{13})?$/,
                                                    message: (
                                                        <IntlMessage
                                                            id={
                                                                "auth.IDNOValidation"
                                                            }
                                                        />
                                                    ),
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
                                                        "account.company.JuridicalAddress"
                                                    }
                                                />
                                            }
                                            name="JuridicalAddress"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your juridical address!",
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
                                                        "account.company.JuridicalName"
                                                    }
                                                />
                                            }
                                            name="JuridicalName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your juridical name!",
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
                                                        "account.company.PhoneNumber"
                                                    }
                                                />
                                            }
                                            name="PhoneNumber"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your phone number!",
                                                },
                                                {
                                                    pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                                                    message:
                                                        "Invalid phone format!",
                                                },
                                            ]}
                                        >
                                            <MaskedInput
                                                mask="+(111) 111 111 11"
                                                onChange={
                                                    this.props.onChangeMask
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12}>
                                        <Form.Item
                                            label={
                                                <IntlMessage
                                                    id={
                                                        "account.company.OfficeAddress"
                                                    }
                                                />
                                            }
                                            name="OfficeAddress"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your office address!",
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
                                                        "account.company.VATCode"
                                                    }
                                                />
                                            }
                                            name="VATCode"
                                            rules={[
                                                {
                                                    required: false,
                                                    message:
                                                        "Please input your VAT code!",
                                                },
                                                {
                                                    pattern: /^[0-9]+$/,
                                                    message:
                                                        "Invalid VAT code format!",
                                                },
                                            ]}
                                        >
                                            <Input />
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
    updateSettings,
    removeAvatar,
    signOut,
};

const mapStateToProps = ({ account, theme, auth }) => {
    const { name, userName, avatar, dateOfBirth, email, phoneNumber } = account;
    const { token } = auth;
    const { locale } = theme;
    return {
        name,
        userName,
        token,
        avatar,
        dateOfBirth,
        email,
        phoneNumber,
        locale,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyForm);
