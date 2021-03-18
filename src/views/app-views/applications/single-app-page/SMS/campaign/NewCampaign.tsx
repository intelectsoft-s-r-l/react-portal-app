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
const NewCampaign = ({ visible, close, getCampaignList }: INewCampaign) => {
  const [form] = Form.useForm();
  const showMessage = useSelector((state: IState) => state.auth?.showMessage);
  const storeMsg = useSelector((state: IState) => state.auth?.message);
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

  const onChange = (info: any) => {
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        let numArr: string = e.target.result
          .split(/[\s\n\r;*\/]+/)
          .filter((el: string) => el !== "")
          .join(",");
        setPhoneNumbers((prev) => [
          ...prev,
          { name: info.file.originFileObj.name, value: numArr },
        ]);
      };
      reader.readAsText(info.file.originFileObj);
    }
  };
  const onFinish = async (values: any) => {
    const uniqNumbers = [
      // @ts-ignore
      ...new Set(
        phoneNumbers
          .map((elem) => elem.value)
          .join(",")
          .split(",")
          .filter((el: string) => el !== "")
      ),
    ].join(",");
    return await new AppService()
      .SMS_UpdateCampaign({
        ...values,
        PhoneList: uniqNumbers,
        ScheduledDate: getScheduledDate(radioVal, date),
      })
      .then((data) => {
        if (data && data.ErrorCode === 0)
          getCampaignList().then(() => message.success(TranslateText(DONE), 1));
      });
  };

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        dispatch(hideAuthMessage());
      }, 2000);
    }
  }, [showMessage]);

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
            <Form.Item
              label={
                <Flex justifyContent="between" className="w-100">
                  <div>{TranslateText("SMS.Receivers")}</div>
                  <div style={{ fontWeight: "normal", color: "red" }}>
                    *csv/txt
                  </div>
                </Flex>
              }
              name="PhoneList"
              // rules={rules.phonelist}
            >
              <motion.div
                initial={{ opacity: 0, marginBottom: 0 }}
                animate={{
                  opacity: showMessage ? 1 : 0,
                  marginBottom: showMessage ? 20 : 0,
                }}
              >
                <Alert type="error" showIcon message={storeMsg} />
              </motion.div>
              <small>
                {/* {TranslateText("SMS.NoContacts")}.{" "} */}
                <Upload
                  // @ts-ignore
                  beforeUpload={async (file: RcFile) => {
                    return await Utils.beforeUploadNumbers(file).then(
                      (canUpload) => {
                        if (canUpload) setIsCsvOrTxt(true);

                        return canUpload;
                      }
                    );
                  }}
                  onChange={onChange}
                  multiple={true}
                  customRequest={Utils.dummyRequest}
                  showUploadList={{
                    showRemoveIcon: false,
                    showPreviewIcon: isCsvOrTxt,
                  }}
                >
                  <small>
                    <a>{TranslateText("SMS.AttachFile")}</a>
                  </small>
                </Upload>
              </small>
              {/* <Input.TextArea
                placeholder={TranslateText("SMS.Receivers.Validate")}
                onChange={(e) => setPhoneNumbers([e.target.value])}
              /> */}
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
