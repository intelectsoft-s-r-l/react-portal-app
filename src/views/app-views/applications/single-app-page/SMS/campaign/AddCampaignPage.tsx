import * as React from "react";
import { useState } from "react";
import { Col, PageHeader, Row } from "antd";
import AddCampaignForm from "./AddCampaignForm";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import Phone from "../../../../../../components/util-components/Phone";

const AddCampaignPage = (props: any) => {
  const [phoneLength, setPhoneLength] = useState<number>(0);
  const [maxPhoneLength, setMaxPhoneLength] = useState<number>(160);
  const [currentSms, setCurrentSms] = useState<number>(1);
  const [message, setMessage] = useState<any>("");
  return (
    <PageHeader
      title={"Add campaign"}
      onBack={() => props.history.push(`${props.match.url}`)}
    >
      <Row gutter={ROW_GUTTER}>
        <Col xxl={16} xl={24} lg={24} md={24}>
          <AddCampaignForm
            {...props}
            setPhoneLength={setPhoneLength}
            phoneLength={phoneLength}
            maxPhoneLength={maxPhoneLength}
            setMaxPhoneLength={setMaxPhoneLength}
            currentSms={currentSms}
            setCurrentSms={setCurrentSms}
            message={message}
            setMessage={setMessage}
          />
        </Col>
        <Col xxl={8} xl={24} lg={24} md={24}>
          <Phone
            setPhoneLength={setPhoneLength}
            phoneLength={phoneLength}
            maxPhoneLength={maxPhoneLength}
            setMaxPhoneLength={setMaxPhoneLength}
            currentSms={currentSms}
            setCurrentSms={setCurrentSms}
            message={message}
            setMessage={setMessage}
          />
        </Col>
      </Row>
    </PageHeader>
  );
};
export default AddCampaignPage;
