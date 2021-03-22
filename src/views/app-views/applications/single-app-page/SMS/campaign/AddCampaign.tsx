import * as React from "react";
import { useEffect, useState } from "react";
import { Col, DatePicker, Form, Input, message, Modal, Radio, Row } from "antd";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import TranslateText from "../../../../../../utils/translate";
import { useDispatch, useSelector } from "react-redux";
import AttachNumbers from "./AttachNumbers";
import { rules, send } from ".";
import { AppService } from "../../../../../../api/app";
import { EnErrorCode } from "../../../../../../api";
import { DONE } from "../../../../../../constants/Messages";
import { Store } from "antd/lib/form/interface";
import { IState } from "../../../../../../redux/reducers";

interface IAddCampaign {
  visible: boolean;
  close: () => void;
  getCampaignList: () => any;
  amount: number;
}

const AddCampaign = ({
  visible,
  close,
  getCampaignList,
  amount,
}: IAddCampaign) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!visible) return;
    form.resetFields();
  }, [visible, form]);

  const onFinish = async ({ Name }: any) => {
    setLoading(true);
    return await new AppService()
      .SMS_UpdateCampaign({ Name })
      .then(async (data) => {
        setLoading(false);
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR)
          await getCampaignList().then(() =>
            message.success(TranslateText(DONE), 1)
          );
      });
  };

  useEffect(() => {
    form.setFieldsValue({
      Name: `${TranslateText("SMS.default.name")} ${amount}`,
    });
  }, [visible]);

  return (
    <Modal
      title={TranslateText("SMS.NewCampaign")}
      visible={visible}
      onOk={async () => {
        form.validateFields().then(async (values) => {
          await onFinish(values);
          close();
        });
      }}
      onCancel={close}
      confirmLoading={loading}
    >
      <Form form={form} name="newCampaign" layout="vertical">
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label={TranslateText("SMS.CampaignName")}
              name="Name"
              rules={rules.Name}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default AddCampaign;
