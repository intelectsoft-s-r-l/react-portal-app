import * as React from "react";
import { useEffect, useState } from "react";
import { Col, DatePicker, Form, Input, Modal, Row, Upload } from "antd";
import { ICampaignList } from "../../../../../../api/sms/types";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import { rules } from "./NewCampaign";
import moment from "moment";
import Utils from "../../../../../../utils";
import TranslateText from "../../../../../../utils/translate";
import { SmsService } from "../../../../../../api/sms";
import { UploadChangeParam } from "antd/es/upload/interface";

interface IEditCampaign {
  getCampaignList: () => void;
  data: Partial<ICampaignList>;
}
const EditCampaignForm = ({ getCampaignList, data }: IEditCampaign) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [phoneNumbers, setPhoneNumbers] = useState<Partial<string[]>>([]);

  useEffect(() => {
    form.setFieldsValue({
      PhoneList: phoneNumbers
        .filter((el: any) => el != "")
        .join(",")
        .replace(/,\s+/g, ""),
    });
  }, [phoneNumbers, setPhoneNumbers]);

  const onChange = (info: UploadChangeParam<any>) => {
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        let numArr: string = e.target.result
          .split(/[\s\n\r;*\/]+/)
          .filter((el: string) => el !== "")
          .join(",");
        setPhoneNumbers((prev) => [...prev, numArr]);
      };
      reader.readAsText(info.file.originFileObj);
    }
  };

  const onFinish2 = async (values: any) => {
    const uniqNumbers = [
      // @ts-ignore
      ...new Set(
        phoneNumbers
          .join(",")
          .split(",")
          .filter((el: string) => el !== "")
      ),
    ].join(",");
    //return await new AppService()
    //.SMS_UpdateCampaign({
    //...values,
    //PhoneList: uniqNumbers,
    //ScheduledDate: getScheduledDate(radioVal, date),
    //})
    //.then((data) => {
    //if (data && data.ErrorCode === 0)
    //getCampaignList().then(() => message.success(TranslateText(DONE), 1));
    //});
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    const ScheduledDate = moment(values.ScheduledDate["_d"]).format(
      "[/Date(]xZZ[))/]"
    );
    return new SmsService()
      .SMS_UpdateCampaign({
        ...data,
        ...values,
        ScheduledDate,
      })
      .then((data) => {
        if (data && data.ErrorCode === 0) {
          setLoading(false);
          getCampaignList();
        }
      });
  };
  return (
    <Form
      form={form}
      name="editCampaign"
      layout="vertical"
      initialValues={{ ...data, ScheduledDate: moment(data.ScheduledDate) }}
    >
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
            label={TranslateText("SMS.Receivers")}
            name="PhoneList"
            rules={rules.PhoneList}
            extra={
              <>
                <small>
                  <Upload
                    onChange={onChange}
                    multiple={true}
                    customRequest={Utils.dummyRequest}
                    showUploadList={false}
                  >
                    <small>
                      <a>{TranslateText("SMS.AttachFile")}</a>
                    </small>
                  </Upload>
                </small>
              </>
            }
          >
            <Input.TextArea
              placeholder={TranslateText("SMS.Receivers.Validate")}
              onChange={(e) => setPhoneNumbers([e.target.value])}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Form.Item
            name={"ScheduledDate"}
            label={TranslateText("SMS.ScheduledDate")}
            rules={rules.ScheduledDate}
          >
            <DatePicker format={"DD/MM/YYYY"} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default EditCampaignForm;
