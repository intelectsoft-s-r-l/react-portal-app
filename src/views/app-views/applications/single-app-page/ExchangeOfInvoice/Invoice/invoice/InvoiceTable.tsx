import * as React from "react";
import { ColumnsType } from "antd/lib/table";
import { EyeOutlined } from "@ant-design/icons";
import { Tooltip, Button } from "antd";
import { InvoiceList } from "../../../../../../../api/edx/edx.types";
import TranslateText from "../../../../../../../utils/translate";
import moment from "moment";

export const invoiceTable = () => {
  const tableColumns: ColumnsType<InvoiceList> = [
    {
      title: "Create date",
      dataIndex: "CreateDate",
      render: (date) => (
        <span>{moment.unix(+date.slice(6, 16)).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "Date",
      render: (date) => (
        <span>{moment.unix(+date.slice(6, 16)).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      title: "Delivery date",
      dataIndex: "DeliveryDate",
      render: (date) => (
        <span>{moment.unix(+date.slice(6, 16)).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      title: "Sender ID",
      dataIndex: "FromCompanyFiscalID",
    },
    {
      title: "Sender name",
      dataIndex: "FromCompany_Name",
    },
    {
      title: "Invoice ID",
      dataIndex: "InvoiceExternalID",
    },
    {
      title: "Number",
      dataIndex: "Number",
    },
    {
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right">
          <Tooltip title={TranslateText("app.devices.view")}>
            <Button
              type="primary"
              className="mr-2"
              icon={<EyeOutlined />}
              size="small"
              onClick={async () => {}}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return tableColumns;
};
