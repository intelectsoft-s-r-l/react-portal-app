import * as React from "react";
import { Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { AppService } from "../../../../../api";
import { ICampaignList } from "../../../../../api/types.response";
import Flex from "../../../../../components/shared-components/Flex";
import NewCampaign from "./NewCampaign";
import Loading from "../../../../../components/shared-components/Loading";
import SmsTable from "./SmsTable";
import EditCampaign from "./EditCampaign";
import { Route, RouteComponentProps } from "react-router-dom";

const SmsCampaign = ({ match }: RouteComponentProps) => {
  const [campaignInfo, setCampaignInfo] = useState<ICampaignList[]>([]);
  const [isNewCampaignVisible, setIsNewCampaignVisible] = useState<boolean>(
    false
  );
  const [isEditCampaignVisible, setEditCampaignVisible] = useState<boolean>(
    false
  );
  const [selectedCampaign, setSelectedCampaign] = useState<
    Partial<ICampaignList>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const getCampaignList = async () => {
    return await new AppService().SMS_GetCampaign().then((data) => {
      setLoading(false);
      if (data) {
        if (data.ErrorCode === 0) {
          setCampaignInfo(data.CampaignList);
          return Promise;
        }
      }
    });
  };

  const showEditCampaign = (data: ICampaignList) => {
    setEditCampaignVisible(true);
    setSelectedCampaign(data);
  };

  useEffect(() => {
    getCampaignList();
  }, []);
  if (loading) {
    return <Loading cover="content" />;
  }
  return (
    <>
      <NewCampaign
        visible={isNewCampaignVisible}
        close={() => setIsNewCampaignVisible(false)}
        getCampaignList={getCampaignList}
      />
      <EditCampaign
        visible={isEditCampaignVisible}
        close={() => setEditCampaignVisible(false)}
        getCampaignList={getCampaignList}
        data={selectedCampaign}
      />
      <Flex justifyContent="between" alignItems="center" className="py-4">
        <h2>Campaign</h2>
        <Button type="primary" onClick={() => setIsNewCampaignVisible(true)}>
          <PlusOutlined />
          <span>New</span>
        </Button>
      </Flex>
      <Table
        columns={SmsTable(getCampaignList, showEditCampaign, match)}
        dataSource={campaignInfo}
        rowKey={"ID"}
      />
    </>
  );
};
export default SmsCampaign;
