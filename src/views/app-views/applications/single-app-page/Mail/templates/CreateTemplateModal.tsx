import { Form, Input, Modal } from "antd";
import React, { ChangeEvent, useState } from "react";
import TextEditor from "../../TextEditor";

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
  const [textEditor, setTextEditor] = useState({
    Name: "",
    Body: "",
    Subject: "",
  });
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTextEditor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onEditorChange = (text: string, name: string) => {
    setTextEditor((prev) => ({
      ...prev,
      [name]: text,
    }));
  };
  const onOk = (values: any) => {
    console.log(textEditor);
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
          <Input name="Name" onChange={onChange} />
        </Form.Item>
        <Form.Item name="Subject" label="Subject">
          <TextEditor
            handleEditorChange={(text: string) =>
              onEditorChange(text, "Subject")
            }
          />
        </Form.Item>
        <Form.Item label="Body">
          <TextEditor
            name="Body"
            handleEditorChange={(text: string) => onEditorChange(text, "Body")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTemplateModal;
