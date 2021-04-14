import React from "react";
import { Form, Avatar, Button, Input, Row, Col, Upload, Empty } from "antd";
import MaskedInput from "antd-mask-input";
import { UserOutlined } from "@ant-design/icons";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import Flex from "../../../../components/shared-components/Flex";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import Utils from "../../../../utils";
import Loading from "../../../../components/shared-components/Loading";
import { IAuth } from "../../../../redux/reducers/Auth";
import { ICompanyData } from "../../../../api/app/types";
import { UploadChangeParam } from "antd/lib/upload";

interface ICompanyForm extends IAuth {
  onChangeMask: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFinish: (values: ICompanyData) => void;
  updateCompany: (values: ICompanyData) => void;
  onUploadAvatar: (info: UploadChangeParam) => void;
  onRemoveAvatar: () => void;
  Company: ICompanyData;
}

const CompanyForm = (props: ICompanyForm) => {
  const {
    onChangeMask,
    onUploadAvatar,
    Company,
    onRemoveAvatar,
    onFinish,
  } = props;
  return (
    <>
      <Flex
        alignItems="center"
        mobileFlex={false}
        className="text-center text-md-left"
      >
        <Avatar size={90} src={Company.Logo} icon={<UserOutlined />} />
        <div className="ml-md-3 mt-md-0 mt-3">
          <Upload
            customRequest={Utils.dummyRequest}
            onChange={onUploadAvatar}
            showUploadList={false}
            beforeUpload={(info) => Utils.beforeUpload(info)}
          >
            <p style={{ marginBottom: "15px" }}>
              * <i>JPEG, PNG. 150x150</i>
            </p>
            <Button type="primary">
              <IntlMessage id={"account.EditProfile.ChangeAvatar"} />
            </Button>
          </Upload>
          <Button className="ml-2" onClick={onRemoveAvatar}>
            <IntlMessage id={"account.EditProfile.Remove"} />
          </Button>
        </div>
      </Flex>
      <div className="mt-4">
        <Form
          name="basicInformation"
          layout="vertical"
          initialValues={Company}
          onFinish={onFinish}
        >
          <Row>
            <Col xs={24} sm={24} md={24} lg={16}>
              <Row gutter={ROW_GUTTER}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<IntlMessage id={"account.company.BIC"} />}
                    name="BIC"
                    rules={[
                      {
                        required: true,
                        message: "Please input your BIC!",
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
                    label={<IntlMessage id={"account.company.Bank"} />}
                    name="Bank"
                    rules={[
                      {
                        required: true,
                        message: "Please input your bank!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={
                      <IntlMessage id={"account.company.CommercialName"} />
                    }
                    name="CommercialName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your commercial name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<IntlMessage id={"account.company.IBAN"} />}
                    name="IBAN"
                    rules={[
                      {
                        required: true,
                        message: "Please input your IBAN!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<IntlMessage id={"account.company.IDNO"} />}
                    name="IDNO"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={
                      <IntlMessage id={"account.company.JuridicalAddress"} />
                    }
                    name="JuridicalAddress"
                    rules={[
                      {
                        required: true,
                        message: "Please input your juridical address!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<IntlMessage id={"account.company.JuridicalName"} />}
                    name="JuridicalName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your juridical name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<IntlMessage id={"account.company.PhoneNumber"} />}
                    name="PhoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please input your phone number!",
                      },
                      {
                        pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                        message: "Invalid phone format!",
                      },
                    ]}
                  >
                    <MaskedInput
                      mask="+(111) 111 111 11"
                      onChange={onChangeMask}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<IntlMessage id={"account.company.OfficeAddress"} />}
                    name="OfficeAddress"
                    rules={[
                      {
                        required: true,
                        message: "Please input your office address!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<IntlMessage id={"account.company.VATCode"} />}
                    name="VATCode"
                    rules={[
                      {
                        required: false,
                        message: "Please input your VAT code!",
                      },
                      {
                        pattern: /^[0-9]+$/,
                        message: "Invalid VAT code format!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<IntlMessage id={"account.company.ShortName"} />}
                    name="ShortName"
                    rules={[
                      {
                        required: false,
                        message: "Please enter a short name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<IntlMessage id={"account.company.PostalCode"} />}
                    name="PostalCode"
                    rules={[
                      {
                        required: false,
                        message: "Please enter a postal code!",
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
                        required: false,
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
                    label={<IntlMessage id="account.company.WebSite" />}
                    name="WebSite"
                    rules={[
                      {
                        required: false,
                        message: "Please input website!",
                      },
                    ]}
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
};
export default CompanyForm;
