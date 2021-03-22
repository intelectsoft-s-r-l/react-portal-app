import * as React from "react";
import { Button, Input, Table } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { AppService } from "../../../../../../api/app";
import { ICampaignList } from "../../../../../../api/app/types";
import Flex from "../../../../../../components/shared-components/Flex";
import AddCampaign from "./AddCampaign";
import SmsTable from "./SmsCampaignTable";
import EditCampaign from "./EditCampaign";
import { RouteComponentProps } from "react-router-dom";
import TranslateText from "../../../../../../utils/translate";
import Utils from "../../../../../../utils";

// 1.First, we create the campaign
// Campaign Modal appears, (Default name is New campaign {number of campaigns})
// after creating it, it appears in the list/table
// 2.Then, we can edit/do stuff with it, by pressing the dots action menu
const CampaignList = ({ match }: RouteComponentProps) => {
  const instance = new AppService();
  const [campaignInfo, setCampaignInfo] = useState<ICampaignList[]>([]);
  const [campaignListToSearch, setCampaignListToSearch] = useState<
    ICampaignList[]
  >([]);
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
  const getCampaignList = async (): Promise<any> => {
    return await instance.SMS_GetCampaign().then((data) => {
      setTableLoading(false);
      if (data && data.ErrorCode === 0) {
        setCampaignListToSearch(data.CampaignList);
        setCampaignInfo(data.CampaignList);
        return Promise;
      }
    });
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const searchArray = value ? campaignInfo : campaignListToSearch;
    const data = Utils.wildCardSearch(searchArray, value);
    setCampaignInfo(data);
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
      <AddCampaign
        visible={isNewCampaignVisible}
        close={() => setIsNewCampaignVisible(false)}
        getCampaignList={getCampaignList}
        amount={campaignInfo.length + 1}
      />
      <EditCampaign
        visible={isEditCampaignVisible}
        close={() => setEditCampaignVisible(false)}
        getCampaignList={getCampaignList}
        data={selectedCampaign}
      />
      <h2>{TranslateText("app.Campaign")}</h2>
      <Flex
        justifyContent="between"
        alignItems="center"
        className="py-4"
        mobileFlex={false}
      >
        <div className="mb-3 mb-md-0">
          <Input
            placeholder={TranslateText("app.Search")}
            prefix={<SearchOutlined />}
            onChange={(e) => onSearch(e)}
          />
        </div>
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
export default CampaignList;
