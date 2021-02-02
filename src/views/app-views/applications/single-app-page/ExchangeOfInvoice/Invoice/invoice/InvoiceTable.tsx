import * as React from "react";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { InvoiceList } from "../../../../../../../api/edx/edx.types";

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
  ];

  return tableColumns;
};
