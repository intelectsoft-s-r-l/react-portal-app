import { Form, Input, Modal } from "antd";
import React, { useState } from "react";

interface ICreateTemplateModal {
  APIKey: string;
  visible: boolean;
  close: () => void;
  getTemplates: () => void;
}
const CreateTemplateModal = ({
  APIKey,
  visible,
  close,
  getTemplates,
}: ICreateTemplateModal) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  return (
    <Modal
      title="Create template"
      visible={visible}
      onCancel={close}
      confirmLoading={loading}
    >
      <Form name="createTemplateForm">
        <Form.Item name="Name" label="Name">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTemplateModal;
