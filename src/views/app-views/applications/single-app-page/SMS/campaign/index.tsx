import * as React from "react";
import { Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { AppService } from "../../../../../../api/app";
import { ICampaignList } from "../../../../../../api/types.response";
import Flex from "../../../../../../components/shared-components/Flex";
import NewCampaign from "./NewCampaign";
import SmsTable from "./SmsCampaignTable";
import EditCampaign from "./EditCampaign";
import { RouteComponentProps } from "react-router-dom";
import TranslateText from "../../../../../../utils/translate";

const SmsCampaign = ({ match }: RouteComponentProps) => {
  const instance = new AppService();
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
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const getCampaignList = async () => {
    return await instance.SMS_GetCampaign().then((data) => {
      setTableLoading(false);
      if (data && data.ErrorCode === 0) {
        setCampaignInfo(data.CampaignList);
        return Promise;
      }
    });
  };

  const showEditCampaign = (data: ICampaignList) => {
    setEditCampaignVisible(true);
    setSelectedCampaign(data);
  };

  useEffect(() => {
    getCampaignList();
    return () => instance._source.cancel();
  }, []);
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
        <h2>{TranslateText("app.Campaign")}</h2>
        <Button type="primary" onClick={() => setIsNewCampaignVisible(true)}>
          <PlusOutlined />
          <span>{TranslateText("SMS.NewCampaign")}</span>
        </Button>
      </Flex>
      <Table
        loading={tableLoading}
        columns={SmsTable(getCampaignList, showEditCampaign, match)}
        dataSource={campaignInfo}
        rowKey={"ID"}
      />
    </>
  );
};
export default SmsCampaign;
