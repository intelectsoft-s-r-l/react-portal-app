import * as React from "react";
import { Result, PageHeader, Button } from "antd";
import { useEffect, useState } from "react";
import { EnErrorCode } from "../../../../../../api";
import { AppService } from "../../../../../../api/app";
import { ICampaignList } from "../../../../../../api/sms/types";
import { useQuery } from "../../../../../../utils/hooks/useQuery";
import Loading from "../../../../../../components/shared-components/Loading";
import { Link } from "react-router-dom";
import { SmsService } from "../../../../../../api/sms";
import AddCampaignForm from "./AddCampaign";
import EditCampaignForm from "./EditCampaign";

const EditCampaignPage = (props: any) => {
  const query = useQuery(); // name: string, id: string
  const [loading, setLoading] = useState<boolean>(true);
  const [campaign, setCampaign] = useState<ICampaignList | undefined>(
    undefined
  );
  const getCampaignInfo = async () => {
    return await new SmsService().SMS_GetCampaign().then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        setCampaign(
          data.CampaignList.find(
            (campaign) => campaign.ID!.toString() === query.get("ID")
          )
        );
      }
    });
  };
  useEffect(() => {
    getCampaignInfo();
    return new AppService()._source.cancel();
  }, []);
  if (loading) {
    return <Loading />;
  }
  if (!campaign) {
    return (
      <Result
        status={"404"}
        title="Campaign not found"
        subTitle="Sorry, the campaign you're trying to reach does not exist."
        extra={
          <Button type="primary">
            <Link to={`${props.match.url}`}>Find your way</Link>
          </Button>
        }
      />
    );
  }
  return (
    <PageHeader
      title={`${query.get("name")}`}
      onBack={() => props.history.goBack()}
    >
      <EditCampaignForm data={campaign} getCampaignList={getCampaignInfo} />
    </PageHeader>
  );
};

export default EditCampaignPage;
