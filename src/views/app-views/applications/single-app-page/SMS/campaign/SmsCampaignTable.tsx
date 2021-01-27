import * as React from "react";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import { ICampaignList } from "../../../../../../api/types.response";
import moment from "moment";
import EllipsisDropdown from "../../../../../../components/shared-components/EllipsisDropdown";
import { Menu, Tag, Modal } from "antd";
import { AppService } from "../../../../../../api";
import { Link } from "react-router-dom";

enum EnSmsType {
  Draft,
  Verifying,
  Declined,
  Scheduled,
  Processing,
  Done,
  Hidden,
}
enum EnCampaignStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}
const SmsTable = (
  refreshList: () => void,
  showEditCampaign: (data: ICampaignList) => void,
  match: any
) => {
  const getDaysLeft = (date: string) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    const scheduledDate = moment(date);
    return Math.round(Math.abs((+today - +scheduledDate) / oneDay));
  };
  const tableColumns: ColumnsType<ICampaignList> = [
    {
      title: "Campaign name",
      dataIndex: "Name",
    },
    {
      title: "Create date",
      dataIndex: "CreateDate",
      render: (date) => (
        <span>{moment.unix(+date.slice(6, 16)).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      title: "Scheduled date",
      dataIndex: "ScheduledDate",
      render: (date) => (
        <Tag>
          <ClockCircleOutlined />
          <span className="font-weight-semibold">
            {getDaysLeft(date) > 1
              ? `${getDaysLeft(date)} days left`
              : getDaysLeft(date) === 1
              ? `${getDaysLeft(date)} day left`
              : "Today"}
          </span>
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (Status: number) => (
        <div>
          <Tag className="mr-0" color={Status === 1 ? "cyan" : "volcano"}>
            {Status === 1 ? "Available" : "Not Available"}
          </Tag>
        </div>
      ),
    },
    {
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right">
          <EllipsisDropdown
            menu={
              <Menu>
                {elm.Status === EnCampaignStatus.INACTIVE ? (
                  <Menu.Item
                    key="0"
                    onClick={async () => {
                      Modal.confirm({
                        title:
                          "Are you sure you want to activate this campaign?",
                        onOk: async () => {
                          return await new AppService()
                            .SMS_UpdateCampaign({
                              ...elm,
                              Status: EnCampaignStatus.ACTIVE,
                            })
                            .then((data) => {
                              if (data && data.ErrorCode === 0) refreshList();
                            });
                        },
                      });
                    }}
                  >
                    <CheckCircleOutlined />
                    <span>Activate</span>
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    key="0"
                    onClick={async () => {
                      Modal.confirm({
                        title:
                          "Are you sure you want to deactivate this campaign?",
                        onOk: async () => {
                          return await new AppService()
                            .SMS_UpdateCampaign({
                              ...elm,
                              Status: EnCampaignStatus.INACTIVE,
                            })
                            .then((data) => {
                              if (data && data.ErrorCode === 0) refreshList();
                            });
                        },
                      });
                    }}
                  >
                    <CloseCircleOutlined />
                    <span>Deactiate</span>
                  </Menu.Item>
                )}
                <Menu.Item key="1">
                  <Link to={`campaign_details=${elm.ID}`}>
                    <EyeOutlined />
                    <span style={{ marginLeft: 5 }}>View</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="2" onClick={() => showEditCampaign(elm)}>
                  <EditOutlined />
                  <span>Edit</span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="3"
                  onClick={async () => {
                    return await new AppService()
                      .SMS_DeleteCampaign(elm.ID)
                      .then((data) => {
                        if (data && data.ErrorCode === 0) {
                          refreshList();
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
        </div>
      ),
    },
  ];

  return tableColumns;
};
export default SmsTable;
