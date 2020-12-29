import * as React from "react";
import {
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Tag from "antd/es/tag";
import { ColumnsType } from "antd/lib/table";
import { ICampaignList } from "../../../../../api/types.response";
import moment from "moment";
import EllipsisDropdown from "../../../../../components/shared-components/EllipsisDropdown";
import { Menu } from "antd";
import { AppService } from "../../../../../api";

enum SMS {
  Draft,
  Verifying,
  Declined,
  Scheduled,
  Processing,
  Done,
  Hidden,
}
const SmsTable = (
  refreshList: () => void,
  showEditCampaign: (data: ICampaignList) => void
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
              : `${getDaysLeft(date)} day left`}
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
                <Menu.Item key="0">
                  <EyeOutlined />
                  <span>View</span>
                </Menu.Item>
                <Menu.Item key="1" onClick={() => showEditCampaign(elm)}>
                  <EditOutlined />
                  <span>Edit</span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="2"
                  onClick={() => {
                    return new AppService()
                      .SMS_DeleteCampaign(elm.ID)
                      .then((data) => {
                        if (data) {
                          if (data.ErrorCode === 0) {
                            refreshList();
                          }
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
