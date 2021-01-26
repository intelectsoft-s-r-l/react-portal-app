import * as React from "react";
import { useEffect, useState } from "react";
import {
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Upload,
} from "antd";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import { AppService } from "../../../../../../api";
import TranslateText from "../../../../../../utils/translate";
import { DONE, UPLOADING } from "../../../../../../constants/Messages";
import Utils from "../../../../../../utils";

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
const NewCampaign = ({ visible, close, getCampaignList }: INewCampaign) => {
  const [form] = Form.useForm();
  const [radioVal, setRadioVal] = useState<number>(0);
  const [date, setDate] = useState<any>();
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  useEffect(() => {
    if (!visible) return;
    form.resetFields();
  }, [visible, form]);

  const onChange = (info: any) => {
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (e.target.result.match(/,/)) {
          setPhoneNumbers((prev) => [...prev, e.target.result]);
        } else if (e.target.result.match(/;/)) {
          setPhoneNumbers((prev) => [
            ...prev,
            e.target.result.replaceAll(";", ","),
          ]);
        } else {
          setPhoneNumbers((prev) => [
            ...prev,
            e.target.result
              .split(/[\s\n]/)
              .slice(0, -1)
              .join(","),
          ]);
        }
      };
      reader.readAsText(info.file.originFileObj);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      PhoneList: phoneNumbers.join(",").replace(/\s+/g, ""),
    });
  }, [phoneNumbers, setPhoneNumbers]);

  const onFinish = async (values: any) => {
    const ScheduledDate = () => {
      if (radioVal === send.DELAY) {
        return Utils.handleDotNetDate(date);
      }
      return Utils.handleDotNetDate(Date.now());
    };
    return await new AppService()
      .SMS_UpdateCampaign({
        ...values,
        ScheduledDate: ScheduledDate(),
      })
      .then((data) => {
        if (data && data.ErrorCode === 0)
          getCampaignList().then(() => message.success(TranslateText(DONE), 1));
      });
  };
  return (
    <Modal
      title={"New campaign"}
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
              label={"Receivers"}
              name="PhoneList"
              rules={rules.PhoneList}
              extra={
                <>
                  <small>
                    You have no contacts just yet.{" "}
                    <Upload
                      onChange={onChange}
                      multiple={true}
                      customRequest={Utils.dummyRequest}
                      showUploadList={false}
                    >
                      <small>
                        <a>Attach file</a>
                      </small>
                    </Upload>
                  </small>
                </>
              }
            >
              <Input.TextArea placeholder="Insert phone numbers, each phone number should be followed by comma." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label={"Send SMS"}>
              <Radio.Group
                value={radioVal}
                onChange={(e) => setRadioVal(e.target.value)}
              >
                <Radio style={radioStyle} value={send.NOW}>
                  Immediately
                </Radio>
                <Radio style={radioStyle} value={send.DELAY}>
                  Delay SMS send
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
