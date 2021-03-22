import * as React from "react";
import { useState, useEffect } from "react";
import Flex from "../../../../../../components/shared-components/Flex";
import { ICampaignList } from "../../../../../../api/app/types";
import { AppService } from "../../../../../../api/app";
import Loading from "../../../../../../components/shared-components/Loading";
import { RouteComponentProps } from "react-router-dom";
import { Card } from "antd";

interface ICampaignDetails extends RouteComponentProps<{ ID: string }> {}
const CampaignDetails = ({ history, match }: ICampaignDetails) => {
  const instance = new AppService();
  const { ID } = match.params;
  const [currentCampaign, setCurrentCampaign] = useState<ICampaignList>();
  const [loading, setLoading] = useState<boolean>(true);
  const getCampaign = async () =>
    await instance.SMS_GetCampaign().then((data) => {
      if (data && data.ErrorCode === 0) {
        setLoading(false);
        setCurrentCampaign(data.CampaignList.find((camp) => camp.ID === +ID));
      }
    });
  useEffect(() => {
    getCampaign();
    return () => instance._source.cancel();
  }, []);
  if (loading) {
    return <Loading cover="content" />;
  }
  if (!currentCampaign) {
    return <h5>No campaign found...</h5>;
  }
  return (
    <>
      <Flex justifyContent="between" alignItems="center" className="py-4">
        <h2>Campaign details</h2>
      </Flex>
      <Card>
        <div>
          <span>
            <b>Name</b>
          </span>
          <p className="campaign-field">{currentCampaign.Name}</p>
        </div>
        <div>
          <span>
            <b>Description</b>
          </span>
          <p className="campaign-field">{currentCampaign.Description}</p>
        </div>
        <div>
          <span>
            <b>Message</b>
          </span>
          <p className="campaign-field">{currentCampaign.Message}</p>
        </div>
        <div>
          <span>
            <b>Reviewer comments</b>
          </span>
          <p className="campaign-field">
            {currentCampaign.ReviewerComments ?? "No reviewer comments yet!"}
          </p>
        </div>
      </Card>
    </>
  );
};

export default CampaignDetails;
