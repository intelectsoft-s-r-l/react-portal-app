import * as React from "react";
import { Button, Card, Col, Empty, Menu, Row, Tooltip, Tag, Table } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { AppService } from "../../../../../api";
import { ICampaignList } from "../../../../../api/types.response";
import Flex from "../../../../../components/shared-components/Flex";
import NewCampaign from "./NewCampaign";
import EllipsisDropdown from "../../../../../components/shared-components/EllipsisDropdown";
import Loading from "../../../../../components/shared-components/Loading";
import moment from "moment";
import Avatar from "antd/lib/avatar/avatar";
import { useSelector } from "react-redux";
import { IState } from "../../../../../redux/reducers";
import SmsTable from "./SmsTable";
import EditCampaign from "./EditCampaign";

const ItemAction = ({
  getCampaignList,
  data,
}: {
  getCampaignList: () => void;
  data: ICampaignList;
}) => {
  return (
    <EllipsisDropdown
      menu={
        <Menu>
          <Menu.Item key="0">
            <EyeOutlined />
            <span>View</span>
          </Menu.Item>
          <Menu.Item key="1">
            <EditOutlined />
            <span>Edit</span>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            key="2"
            onClick={async () => {
              return await new AppService()
                .SMS_DeleteCampaign(data.ID)
                .then((data) => {
                  if (data.ErrorCode === 0) {
                    getCampaignList();
                  }
                });
            }}
          >
            <DeleteOutlined />
            <span>Delete</span>
          </Menu.Item>
        </Menu>
      }
    />
  );
};
const GridItem = ({
  getCampaignList,
  data,
  account,
}: {
  getCampaignList: () => void;
  data: ICampaignList;
  account: any;
}) => {
  const getDaysLeft = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    const scheduledDate = moment(data.ScheduledDate);
    return Math.round(Math.abs((+today - +scheduledDate) / oneDay));
  };

  return (
    <Card>
      <div>
        <Flex alignItems="center" justifyContent="between">
          <h4 className="mb-0">{data.Name}</h4>
          <ItemAction data={data} getCampaignList={getCampaignList} />
        </Flex>
        <span className="text-muted">{data.Description}</span>
        <Card className="mt-2" style={{ borderRadius: 0 }}>
          <span>{data.Message}</span>
        </Card>
      </div>
      <div className="mt-2">
        <span className="text-muted">{data.ReviewerComments}</span>
      </div>
      <Flex className="mt-2" justifyContent="between" alignItems="center">
        <Tooltip title={account.FirstName ?? "Moderator"}>
          <Avatar src={account.Photo} icon={<UserOutlined />} />
        </Tooltip>
        <div>
          <Tag className="bg-gray-lightest">
            <ClockCircleOutlined />
            <span className="font-weight-semibold">
              {getDaysLeft() > 1
                ? `${getDaysLeft()} days left`
                : `${getDaysLeft()} day left`}
            </span>
          </Tag>
        </div>
      </Flex>
    </Card>
  );
};
const SmsCampaign = () => {
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
  const account = useSelector((state: IState) => state["account"]);
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
        columns={SmsTable(getCampaignList, showEditCampaign)}
        dataSource={campaignInfo}
        rowKey={"ID"}
      />
    </>
  );
};
export default SmsCampaign;
