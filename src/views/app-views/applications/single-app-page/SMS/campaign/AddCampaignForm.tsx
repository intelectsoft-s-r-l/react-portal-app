import * as React from "react";
import { useState, useEffect } from "react";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Card,
  Button,
  Spin,
  Modal,
} from "antd";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import TranslateText from "../../../../../../utils/translate";
import { getScheduledDate, send } from ".";
import { MAX_SMS } from ".";
import moment from "moment";
import { useDispatch } from "react-redux";
import { SmsService } from "../../../../../../api/sms";
import { EnErrorCode } from "../../../../../../api";
import Utils from "../../../../../../utils";
import { EnSmsType } from "./SmsCampaignTable";

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

//
const AddCampaignForm = ({
  phoneLength,
  setPhoneLength,
  maxPhoneLength,
  setMaxPhoneLength,
  currentSms,
  setCurrentSms,
  setMessage,
  message,
  history,
  match,
}: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [radioVal, setRadioVal] = useState<number>(2);
  const [date, setDate] = useState<any>();
  const [phoneNumbers, setPhoneNumbers] = useState<string>("");
  //const [isCsvOrTxt, setIsCsvOrTxt] = useState<boolean>(false);

  const createCampaign = async (status: number, values: any) => {
    setLoading(true);
    return await new SmsService()
      .SMS_UpdateCampaign({
        ...values,
        ScheduledDate:
          radioVal === send.NOW ? "" : Utils.handleDotNetDate(date),
        Status: status,
      })
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          history.push(`${match.url}/success`);
        }
      });
  };
  const onFinish = async (values: any) => {
    createCampaign(radioVal, values);
  };
  return (
    <Spin spinning={loading}>
      <Card>
        <Form
          form={form}
          name="newCampaign"
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={ROW_GUTTER}>
            <Col xs={24} sm={24} md={24}>
              <Form.Item
                label={TranslateText("SMS.CampaignName")}
                name="Name"
                initialValue={`Campaign ${moment().format("DD-MM-YYYY")}`}
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
                extra={
                  <small>
                    <b>{currentSms}</b> SMS{" "}
                    {`(${phoneLength}/${maxPhoneLength})`}
                  </small>
                }
              >
                <Input.TextArea
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setPhoneLength(e.target.value.length);
                    const dynCurrentSms = Math.ceil(
                      e.target.value.length / MAX_SMS
                    );
                    setCurrentSms(dynCurrentSms);
                    setMaxPhoneLength(MAX_SMS * dynCurrentSms);
                    if (e.target.value.length < MAX_SMS) {
                      setCurrentSms(1);
                      setMaxPhoneLength(MAX_SMS);
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24}>
              <Form.Item
                label={TranslateText("SMS.Receivers")}
                name="PhoneList"
                rules={rules.PhoneList}
              >
                <Input.TextArea
                  placeholder={TranslateText("SMS.Receivers.Validate")}
                  onChange={(e) => setPhoneNumbers(e.target.value)}
                />
              </Form.Item>
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
                  <Radio style={radioStyle} value={send.DRAFT}>
                    Draft
                  </Radio>
                </Radio.Group>
                <div>
                  <DatePicker
                    format={"DD/MM/YYYY"}
                    onChange={(e) => setDate(e)}
                    className={`${radioVal === send.DELAY ? "" : "d-none"}`}
                    disabledDate={(current) =>
                      current && current.valueOf() < Date.now()
                    }
                  />
                </div>
              </Form.Item>
              <Form.Item>
                <div>
                  <Button type="primary" htmlType="submit" className="mr-3">
                    {radioVal === send.DRAFT ? "Draft campaign" : "Save"}
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Spin>
  );
};
export default AddCampaignForm;
