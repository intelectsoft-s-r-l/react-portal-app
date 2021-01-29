import React from "react";
import { Row, Col, Input, Modal, Form } from "antd";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import { AuthService } from "../../../../api";
import { useSelector } from "react-redux";
import { IState } from "../../../../redux/reducers";

interface IUserModalAdd {
  onCancel: () => void;
  visible: boolean;
  getUsersInfo: () => Promise<void>;
}

export const UserModalAdd = ({
  onCancel,
  visible,
  getUsersInfo,
}: IUserModalAdd) => {
  const [form] = Form.useForm();
  const loading = useSelector((state: IState) => state.auth?.loading);
  const CompanyID = useSelector((state: IState) => state.account?.CompanyID);
  const UiLanguage = useSelector((state: IState) => state.account?.UiLanguage);

  const onFinish = async (values: any) => {
    return await new AuthService()
      .RegisterUser({ ...values, CompanyID, UiLanguage: 0 })
      .then((data) => {
        if (data && data.ErrorCode === 0) {
          getUsersInfo();
        }
      });
  };
  return (
    <Modal
      title={"Invite user"}
      visible={visible}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async (values) => {
          await onFinish(values);
          onCancel();
        });
      }}
    >
      <Form form={form} name="basicInformation" layout="vertical">
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={<IntlMessage id={"account.EditProfile.FirstName"} />}
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
              label={<IntlMessage id={"account.EditProfile.LastName"} />}
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
          <Col xs={24} sm={24} md={24}>
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
        </Row>
      </Form>
    </Modal>
  );
};
