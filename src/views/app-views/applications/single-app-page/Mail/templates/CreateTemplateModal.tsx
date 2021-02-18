import React, { ChangeEvent, useState } from "react";
import ReactQuill from "react-quill";
import { Form, Input, message, Modal } from "antd";
import TextEditor from "../../TextEditor";
import { MailService } from "../../../../../../api/mail";
import { EnErrorCode } from "../../../../../../api/";

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

  const onFinish = async (values: any) => {
    setLoading(true);
    console.log(values);
    return await new MailService()
      .UpdateTemplate({
        Name: values.Name,
        Subject: Buffer.from(JSON.stringify(values.Subject)).toString("base64"),
        Body: Buffer.from(JSON.stringify(values.Body)).toString("base64"),
        APIKey,
      })
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          message.success("Template created!");
          getTemplates();
        }
      });
  };

  const onOk = (values: any) => {
    form.validateFields().then(async (values) => {
      await onFinish(values);
      close();
    });
  };
  return (
    <Modal
      title="Create template"
      visible={visible}
      onCancel={close}
      onOk={onOk}
      confirmLoading={loading}
    >
      <Form name="createTemplateForm" layout="vertical" form={form}>
        <Form.Item name="Name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="Subject" label="Subject" initialValue="">
          <ReactQuill />
        </Form.Item>
        <Form.Item label="Body" initialValue="" name="Body">
          <ReactQuill />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTemplateModal;
