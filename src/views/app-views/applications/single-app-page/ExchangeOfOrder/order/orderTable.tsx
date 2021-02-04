import * as React from "react";
import { ColumnsType } from "antd/lib/table";
import { IOrderList } from "../../../../../../api/edx/edx.types";
import Tooltip from "antd/es/tooltip";
import TranslateText from "../../../../../../utils/translate";
import { Link, RouteComponentProps } from "react-router-dom";
import { Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";

export const orderTable = (
  props: RouteComponentProps,
  date: any,
  orderType: string
) => {
  const tableColumns: ColumnsType<IOrderList> = [
    {
      title: "Number",
      dataIndex: "Number",
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
      dataIndex: "FromCompanyName",
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
              )}&type=${orderType}}`}
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
