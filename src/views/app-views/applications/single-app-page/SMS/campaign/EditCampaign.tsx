import * as React from "react";
import { useEffect } from "react";
import { Col, DatePicker, Form, Input, Modal, Row } from "antd";
import { ICampaignList } from "../../../../../../api/types.response";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import { rules } from "./NewCampaign";
import moment from "moment";
import { AppService } from "../../../../../../api";

interface IEditCampaign {
  visible: boolean;
  close: () => void;
  getCampaignList: () => void;
  data: Partial<ICampaignList>;
}
const EditCampaign = ({
  visible,
  close,
  getCampaignList,
  data,
}: IEditCampaign) => {
  useEffect(() => {
    if (!visible) return;
    form.resetFields();
  }, [visible]);
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    const ScheduledDate = moment(values.ScheduledDate["_d"]).format(
      "[/Date(]xZZ[))/]"
    );
    return new AppService()
      .SMS_UpdateCampaign({
        ...data,
        ...values,
        ScheduledDate,
      })
      .then((data) => {
        if (data) {
          if (data.ErrorCode === 0) {
            getCampaignList();
          }
        }
      });
  };
  return (
    <Modal
      title="Edit campaign"
      visible={visible}
      destroyOnClose
      onCancel={close}
      onOk={() => {
        form.validateFields().then((values) => {
          close();
          onFinish(values);
        });
      }}
    >
      <Form
        form={form}
        name="editCampaign"
        layout="vertical"
        initialValues={{ ...data, ScheduledDate: moment(data.ScheduledDate) }}
      >
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
              name={"ScheduledDate"}
              label={"Scheduled date"}
              rules={rules.ScheduledDate}
            >
              <DatePicker format={"DD/MM/YYYY"} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default EditCampaign;
