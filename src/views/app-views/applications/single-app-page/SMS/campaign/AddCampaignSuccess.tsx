import * as React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";

const AddCampaignSuccess = (props: any) => {
  return (
    <Result
      status="info"
      title="Campaign was created!"
      subTitle="Waiting for moderator approval"
      extra={[
        <Link to={`${props.match.url}/add`}>
          <Button type="primary" key="Create">
            Create campaign
          </Button>
        </Link>,
        <Link to={`${props.match.url}`}>
          <Button key="CampaignList">Go to list</Button>
        </Link>,
      ]}
    />
  );
};
export default AddCampaignSuccess;
