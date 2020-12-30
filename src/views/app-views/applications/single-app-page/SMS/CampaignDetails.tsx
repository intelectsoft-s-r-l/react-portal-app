import * as React from "react";
import { useState, useEffect } from "react";
import Flex from "../../../../../components/shared-components/Flex";
import { ICampaignList } from "../../../../../api/types.response";
import { AppService } from "../../../../../api";
import Loading from "../../../../../components/shared-components/Loading";

const CampaignDetails = ({ history, match }: any) => {
  const { ID } = match.params;
  const [currentCampaign, setCurrentCampaign] = useState<ICampaignList>();
  const [loading, setLoading] = useState<boolean>(true);
  const getCampaign = async () =>
    await new AppService().SMS_GetCampaign().then((data) => {
      if (data) {
        if (data.ErrorCode === 0) {
          setLoading(false);
          setCurrentCampaign(data.CampaignList.find((camp) => camp.ID === +ID));
        }
      }
    });
  useEffect(() => {
    getCampaign();
  }, [match]);
  if (loading) {
    return <Loading cover="content" />;
  }
  return (
    <>
      <Flex justifyContent="between" alignItems="center" className="py-4">
        <h2>Campaign details</h2>
      </Flex>
      {currentCampaign && <div>{currentCampaign.Name}</div>}
    </>
  );
};

export default CampaignDetails;
