import * as React from "react";
import { Col, PageHeader, Row } from "antd";
import AddCampaignForm from "./AddCampaign";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import Phone from "../../../../../../components/util-components/Phone";

const AddCampaignPage = (props: any) => {
  return (
    <PageHeader title={"Add campaign"} onBack={() => props.history.goBack()}>
      <Row gutter={ROW_GUTTER}>
        <Col xxl={16} xl={24} lg={24} md={24}>
          <AddCampaignForm {...props} />
        </Col>
        <Col xxl={8} xl={24} lg={24} md={24}>
          <Phone />
        </Col>
      </Row>
    </PageHeader>
  );
};
export default AddCampaignPage;
