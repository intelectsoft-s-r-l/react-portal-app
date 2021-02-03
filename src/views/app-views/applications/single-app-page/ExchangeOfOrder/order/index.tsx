import React from "react";
import { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { EdxService } from "../../../../../../api/edx";
import { IOrderList } from "../../../../../../api/edx/edx.types";
import moment from "moment";
import TranslateText from "../../../../../../utils/translate";
import { Card, Col, DatePicker, Row, Table } from "antd";
import { orderTable } from "./orderTable";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
interface IOrder extends RouteComponentProps {
  APIKey: string;
}
const Order = (props: IOrder) => {
  const { APIKey } = props;
  const edxInstance = new EdxService();
  const [date, setDate] = useState<any>([
    moment().clone().startOf("month"),
    moment().clone().endOf("month"),
  ]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<IOrderList[]>([]);
  const onDateChange = (value: any) => {
    setDate([value[0], value[1]]);
    getOrderList(value[0], value[1]);
  };
  const getOrderList = async (firstDate = date[0], secondDate = date[1]) => {
    setLoading(true);
    return await edxInstance
      .GetOrder(
        APIKey,
        firstDate.format("DD-MM-YYYY"),
        secondDate.format("DD-MM-YYYY")
      )
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === 0) setOrder(data.OrderList);
      });
  };

  useEffect(() => {
    getOrderList();
    return () => edxInstance._source.cancel();
  }, []);
  return (
    <>
      <h2 className="mb-4">{TranslateText("app.Order")}</h2>
      <Row gutter={ROW_GUTTER}>
        <Col span={24}>
          <Card
            title={"Order list"}
            extra={
              <DatePicker.RangePicker
                format={"DD-MM-YYYY"}
                defaultValue={date}
                onChange={onDateChange}
              />
            }
          >
            <Table
              columns={orderTable()}
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
