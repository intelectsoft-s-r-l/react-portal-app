import * as React from "react";
import { ColumnsType } from "antd/lib/table";
import { IOrderList } from "../../../../../../api/edx/edx.types";
import moment from "moment";

export const orderTable = () => {
  const tableColumns: ColumnsType<IOrderList> = [
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
      dataIndex: "FromCompanyName",
    },
    {
      title: "Order ID",
      dataIndex: "OrderExternalID",
    },
    {
      title: "Number",
      dataIndex: "Number",
    },
  ];

  return tableColumns;
};
