import * as React from "react";
import { useEffect, useState } from "react";
import {
  Col,
  Alert,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Upload,
} from "antd";
import { motion } from "framer-motion";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import { AppService } from "../../../../../../api/app";
import TranslateText from "../../../../../../utils/translate";
import { DONE, UPLOADING } from "../../../../../../constants/Messages";
import Utils from "../../../../../../utils";
import Flex from "../../../../../../components/shared-components/Flex";
import { RcFile } from "antd/lib/upload";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../../../../../../redux/reducers";
import { hideAuthMessage } from "../../../../../../redux/actions/Auth";
import { UploadFile } from "antd/es/upload/interface";
import AttachNumbers from "./AttachNumbers";

interface INewCampaign {
  visible: boolean;
  close: () => void;
  getCampaignList: () => any;
}

export const rules = {
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
  PhoneList: [
    {
      required: true,
      message: "Please input a phone list!",
    },
    {
      pattern: /^\d+(,\d+)*$/,
      message: "Numbers should be followed by comma",
    },
  ],
  ScheduledDate: [
    {
      required: false,
      message: "Please insert a scheduled date!",
    },
  ],
};
const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};
enum send {
  NOW = 0,
  DELAY = 1,
}
function getScheduledDate(val: number, date: any) {
  if (val === send.DELAY) {
    return Utils.handleDotNetDate(date);
  }
  return Utils.handleDotNetDate(Date.now());
}
export interface IPhoneNumbers {
  name: string;
  value: string;
}

const NewCampaign = ({ visible, close, getCampaignList }: INewCampaign) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [radioVal, setRadioVal] = useState<number>(0);
  const [date, setDate] = useState<any>();
  const [phoneNumbers, setPhoneNumbers] = useState<
    { name: string; value: string }[]
  >([]);
  const [isCsvOrTxt, setIsCsvOrTxt] = useState<boolean>(false);
  useEffect(() => {
    if (!visible) return;
    form.resetFields();
  }, [visible, form]);

  const onFinish = (values: any) => {};

  return (
    <Modal
      title={TranslateText("SMS.NewCampaign")}
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
            <Form.Item
              label={TranslateText("SMS.CampaignName")}
              name="Name"
              rules={rules.Name}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label={TranslateText("SMS.Description")}
              name="Description"
              rules={rules.Description}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label={TranslateText("SMS.Message")}
              name="Message"
              rules={rules.Message}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <AttachNumbers
              phoneNumbers={phoneNumbers}
              setPhoneNumbers={setPhoneNumbers}
              isCsvOrTxt={isCsvOrTxt}
              setIsCsvOrTxt={setIsCsvOrTxt}
            />
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label={TranslateText("SMS.SendSMS")}>
              <Radio.Group
                value={radioVal}
                onChange={(e) => setRadioVal(e.target.value)}
              >
                <Radio style={radioStyle} value={send.NOW}>
                  {TranslateText("SMS.Immediately")}
                </Radio>
                <Radio style={radioStyle} value={send.DELAY}>
                  {TranslateText("SMS.DelaySMSSend")}
                </Radio>
              </Radio.Group>
              <div>
                <DatePicker
                  format={"DD/MM/YYYY"}
                  onChange={(e) => setDate(e)}
                  className={`${radioVal === send.NOW ? "d-none" : ""}`}
                  disabledDate={(current) =>
                    current && current.valueOf() < Date.now()
                  }
                />
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default NewCampaign;
