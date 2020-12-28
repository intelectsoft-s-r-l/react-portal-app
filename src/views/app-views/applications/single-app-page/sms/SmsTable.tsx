import Tag from "antd/es/tag";
import { ColumnsType } from "antd/lib/table";
import * as React from "react";
import { ICampaignList } from "../../../../../api/types.response";

const SmsTable = () => {
  const tableColumns: ColumnsType<ICampaignList> = [
    {
      title: "Company name",
      dataIndex: "CompanyName",
    },
    {
      title: "Create date",
      dataIndex: "CreateDate",
    },
    {
      title: "Reviewed by",
      dataIndex: "ReviewedByUser",
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
  ];

  return tableColumns;
};
export default SmsTable;
