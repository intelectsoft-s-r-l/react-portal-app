import * as React from "react";
import { ColumnsType } from "antd/lib/table";
import { EyeOutlined } from "@ant-design/icons";
import { Tooltip, Button } from "antd";
import { InvoiceList } from "../../../../../../api/edx/edx.types";
import TranslateText from "../../../../../../utils/translate";
import moment from "moment";
import { Link, RouteComponentProps } from "react-router-dom";

export const invoiceTable = (
  props: RouteComponentProps,
  date: any,
  invoiceType: string
) => {
  const tableColumns: ColumnsType<InvoiceList> = [
    {
      title: "Number",
      dataIndex: "Number",
    },
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
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right">
          <Tooltip title={TranslateText("app.devices.view")}>
            <Link
              to={`${props.match.url}?number=${
                elm.Number
              }&dstart=${date[0].format("DD-MM-YYYY")}&dend=${date[1].format(
                "DD-MM-YYYY"
              )}&type=${invoiceType}}`}
            >
              <Button
                type="primary"
                className="mr-2"
                icon={<EyeOutlined />}
                size="small"
              />
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  return tableColumns;
};
