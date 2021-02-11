import React from "react";
import { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { EdxService } from "../../../../../../api/edx";
import { IOrderList } from "../../../../../../api/edx/edx.types";
import moment from "moment";
import TranslateText from "../../../../../../utils/translate";
import { Card, Col, DatePicker, Row, Table, Select } from "antd";
import { orderTable } from "./orderTable";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
interface IOrder extends RouteComponentProps {
  APIKey: string;
}
export enum EnOrderType {
  _IN = "received",
  _OUT = "sent",
}
const Order = (props: IOrder) => {
  const edxInstance = new EdxService();
  const [date, setDate] = useState<any>([moment(), moment()]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<IOrderList[]>([]);
  const [orderType, setOrderType] = useState<string>(EnOrderType._IN);
  const onDateChange = (value: any) => {
    setDate([value[0], value[1]]);
    getOrderList(value[0], value[1], orderType);
  };
  const getOrderList = async (
    firstDate = date[0],
    secondDate = date[1],
    ordType: string
  ) => {
    setLoading(true);
    let instanceType: "GetOrder" | "GetSentOrder" =
      ordType === EnOrderType._IN ? "GetOrder" : "GetSentOrder";
    return await edxInstance[instanceType](
      props.APIKey,
      firstDate.format("DD-MM-YYYY"),
      secondDate.format("DD-MM-YYYY")
    ).then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === 0) setOrder(data.OrderList);
    });
  };

  useEffect(() => {
    getOrderList(date[0], date[1], orderType);
    return () => edxInstance._source.cancel();
  }, [orderType]);
  return (
    <>
      <h2 className="mb-4">{TranslateText("app.Order")}</h2>
      <Row gutter={ROW_GUTTER}>
        <Col span={24}>
          <Card
            title={
              <Select
                className="mr-2"
                defaultValue={orderType}
                onChange={(value) => setOrderType(value)}
              >
                <Select.Option value={EnOrderType._IN}>
                  Received Orders
                </Select.Option>
                <Select.Option value={EnOrderType._OUT}>
                  Sent Orders
                </Select.Option>
              </Select>
            }
            extra={
              <DatePicker.RangePicker
                format={"DD-MM-YYYY"}
                defaultValue={date}
                onChange={onDateChange}
              />
            }
          >
            <Table
              columns={orderTable(props, date, orderType)}
              className="no-border-last"
              dataSource={order}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Order;
