import * as React from "react";
import { useEffect } from "react";
import { Col, DatePicker, Form, Input, message, Modal, Row } from "antd";
import { ROW_GUTTER } from "../../../../../constants/ThemeConstant";
import moment from "moment";
import { ClientApi } from "../../../../../api";
import WithStringTranslate from "../../../../../utils/translate";
import { DONE } from "../../../../../constants/Messages";

interface INewCampaign {
  visible: boolean;
  close: () => void;
  getCampaignList: () => any;
}

const rules = {
  Name: [
    {
      required: true,
      message: "Please input a campaign name!",
    },
  ],
  Description: [
    {
      required: true,
      message: "Please input a short description!",
    },
  ],
  Message: [
    {
      required: true,
      message: "Please input a message!",
    },
  ],
  ScheduledDate: [
    {
      required: true,
      message: "Please insert a scheduled date!",
    },
  ],
};
const NewCampaign = ({ visible, close, getCampaignList }: INewCampaign) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (!visible) return;
    form.resetFields();
  }, [visible, form]);
  const onFinish = async (values: any) => {
    const ScheduledDate = moment(values.ScheduledDate["_d"]).format(
      "[/Date(]xZZ[))/]"
    );
    return await new ClientApi()
      .SMS_UpdateCampaign({
        ...values,
        ScheduledDate,
      })
      .then((data) => {
        if (data) {
          if (data.ErrorCode === 0) {
            getCampaignList().then(() =>
              message.success(WithStringTranslate(DONE), 1)
            );
          }
        }
      });
  };
  return (
    <Modal
      title={"Add campaign"}
      visible={visible}
      onOk={() => {
        form.validateFields().then((values) => {
          close();
          onFinish(values);
        });
      }}
      onCancel={close}
    >
      <Form form={form} name="newCampaign" layout="vertical">
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label={"Campaign name"} name="Name" rules={rules.Name}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label={"Description"}
              name="Description"
              rules={rules.Description}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label={"Message"} name="Message" rules={rules.Message}>
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label={"Scheduled date"}
              name="ScheduledDate"
              rules={rules.ScheduledDate}
            >
              <DatePicker
                format={"DD/MM/YYYY"}
                disabledDate={(current) =>
                  current && current.valueOf() < Date.now()
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default NewCampaign;
