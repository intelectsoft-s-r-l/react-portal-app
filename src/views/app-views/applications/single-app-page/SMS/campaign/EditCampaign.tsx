import * as React from "react";
import { useEffect, useState } from "react";
import { Col, DatePicker, Form, Input, Modal, Row, Upload } from "antd";
import { ICampaignList } from "../../../../../../api/types.response";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import { rules } from "./NewCampaign";
import moment from "moment";
import { AppService } from "../../../../../../api";
import Utils from "../../../../../../utils";

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

  useEffect(() => {
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
      title="Edit campaign"
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
                    {phoneNumbers.length > 0
                      ? ""
                      : "You have no contacts just yet. "}
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
              <Input.TextArea
                placeholder="Insert phone numbers, each phone number should be followed by comma."
                onChange={(e) => setPhoneNumbers([e.target.value])}
              />
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
