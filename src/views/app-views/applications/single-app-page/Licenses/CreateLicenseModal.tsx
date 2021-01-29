import { Row, Modal, Form, Col, Input } from "antd";
import React, { useState } from "react";
import { ROW_GUTTER } from "../../../../../constants/ThemeConstant";
import { AppService } from "../../../../../api";

const CreateLicenseModal = ({
  AppType,
  visible,
  close,
  getAppLicenses,
}: any) => {
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
    form
      .validateFields()
      .then(async (values) => {
        await onFinish(values);
        close();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  return (
    <Modal
      onOk={onOk}
      onCancel={close}
      visible={visible}
      confirmLoading={isLoading}
      title="Add license"
    >
      <Form layout="vertical" form={form}>
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label={"Quantity"}
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
