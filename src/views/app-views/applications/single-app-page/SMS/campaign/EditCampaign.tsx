import * as React from "react";
import { useEffect, useState } from "react";
import { Col, DatePicker, Form, Input, Modal, Row, Upload } from "antd";
import { ICampaignList } from "../../../../../../api/app/types";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import { rules } from "./NewCampaign";
import moment from "moment";
import { AppService } from "../../../../../../api/app";
import Utils from "../../../../../../utils";
import TranslateText from "../../../../../../utils/translate";

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
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [phoneNumbers, setPhoneNumbers] = useState<Partial<string[]>>([]);

  /*  Destroy initialValues of form after Modal is closed */
  useEffect(() => {
    if (!visible) return;
    form.resetFields();
    setPhoneNumbers([data.PhoneList]);
  }, [visible]);

  useEffect(() => {
    form.setFieldsValue({
      PhoneList: phoneNumbers
        .filter((el: any) => el != "")
        .join(",")
        .replace(/,\s+/g, ""),
    });
  }, [phoneNumbers, setPhoneNumbers]);

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
          // If there are spaces or new lines
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

  const onFinish = async (values: any) => {
    setLoading(true);
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
        if (data && data.ErrorCode === 0) {
          setLoading(false);
          getCampaignList();
        }
      });
  };
  return (
    <Modal
      title={TranslateText("SMS.EditCampaign")}
      visible={visible}
      destroyOnClose
      onCancel={close}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async (values) => {
          await onFinish(values);
          close();
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
    </Modal>
  );
};
export default EditCampaign;
