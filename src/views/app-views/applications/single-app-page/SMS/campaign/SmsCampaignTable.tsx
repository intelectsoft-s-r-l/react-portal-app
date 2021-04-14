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
import { ICampaignList } from "../../../../../../api/sms/types";
import moment from "moment";
import EllipsisDropdown from "../../../../../../components/shared-components/EllipsisDropdown";
import { Menu, Tag, Modal } from "antd";
import { AppService } from "../../../../../../api/app";
import { Link } from "react-router-dom";
import TranslateText from "../../../../../../utils/translate";
import Utils from "../../../../../../utils";
import { SmsService } from "../../../../../../api/sms";

export enum EnSmsType {
  Draft = 0,
  Scheduled = 1,
  Instant = 2,
}
// de la 9:00 pana la 18:00
export enum EnCampaignStatus {
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
  const instance = new SmsService();
  const tableColumns: ColumnsType<ICampaignList> = [
    {
      title: TranslateText("SMS.CampaignName"),
      dataIndex: "Name",
    },
    {
      title: TranslateText("SMS.CreateDate"),
      dataIndex: "CreateDate",
      render: (date) => <span>{Utils.fromDotNetDate(date)}</span>,
    },
    {
      title: TranslateText("SMS.ScheduledDate"),
      dataIndex: "ScheduledDate",
      render: (date) => <span>{Utils.fromDotNetDate(date)}</span>,
    },
    {
      title: TranslateText("SMS.Status"),
      dataIndex: "Status",
      render: (Status: number) => (
        <div>
          <Tag className="mr-0">
            {Status === EnSmsType.Draft
              ? "Draft"
              : Status === EnSmsType.Scheduled
              ? "Scheduled"
              : "Executing"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Contacts",
      render: (_, elm) => (
        <span>{elm.PhoneList ? elm.PhoneList!.split(",").length : 0}</span>
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
                        title: TranslateText("SMS.campaign.activate.msg"),
                        onOk: async () => {
                          return await instance
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
                    <span>{TranslateText("users.Activate")}</span>
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    key="0"
                    onClick={async () => {
                      Modal.confirm({
                        title: TranslateText("SMS.campaign.deactivate.msg"),
                        onOk: async () => {
                          return await instance
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
                    <span>{TranslateText("users.Disable")}</span>
                  </Menu.Item>
                )}
                <Menu.Item key="1">
                  <Link to={`campaign_details=${elm.ID}`}>
                    <EyeOutlined />
                    <span style={{ marginLeft: 5 }}>
                      {TranslateText("users.ViewDetails")}
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="2" onClick={() => showEditCampaign(elm)}>
                  <EditOutlined />
                  <span>{TranslateText("users.Edit")}</span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="3"
                  onClick={async () => {
                    return await instance
                      .SMS_DeleteCampaign(elm.ID!)
                      .then((data) => {
                        if (data && data.ErrorCode === 0) {
                          refreshList();
                        }
                      });
                  }}
                >
                  <DeleteOutlined />
                  <span>{TranslateText("app.Delete")}</span>
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
