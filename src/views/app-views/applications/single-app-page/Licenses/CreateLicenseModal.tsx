import { Row, Modal, Form, Col, Input } from "antd";
import React, { useState } from "react";
import { ROW_GUTTER } from "../../../../../constants/ThemeConstant";
import { AppService } from "../../../../../api/app";
import TranslateText from "../../../../../utils/translate";

interface ICreateLicenseModal {
  AppType: number;
  visible: boolean;
  close: () => void;
  getAppLicenses: (AppType: number) => void;
}
const CreateLicenseModal = ({
  AppType,
  visible,
  close,
  getAppLicenses,
}: ICreateLicenseModal) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    setIsLoading(true);
    return new AppService()
      .RequestLicense(AppType, values.Quantity)
      .then((data) => {
        setIsLoading(false);
        if (data && data.ErrorCode === 0) getAppLicenses(AppType);
      });
  };
  const onOk = () => {
    form.validateFields().then(async (values) => {
      await onFinish(values);
      close();
    });
  };
  return (
    <Modal
      onOk={onOk}
      onCancel={close}
      visible={visible}
      confirmLoading={isLoading}
      title={TranslateText("app.licenses.add")}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label={TranslateText("app.licenses.quantity")}
              name="Quantity"
              rules={[
                {
                  required: true,
                  message: "Please insert quantity",
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
export default CreateLicenseModal;
