import * as React from "react";
import { useState, useEffect } from "react";
import { Card, Col, DatePicker, Row, Select, Table } from "antd";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { EdxService } from "../../../../../../api/edx";
import TranslateText from "../../../../../../utils/translate";
import { invoiceTable } from "./InvoiceTable";
import moment from "moment";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import { InvoiceList } from "../../../../../../api/edx/types";
interface Invoice extends RouteComponentProps {
  APIKey: string;
}
export enum EnInvoiceType {
  _IN = "received",
  _OUT = "sent",
}
const Invoice = (props: Invoice) => {
  const edxInstance = new EdxService();
  const [date, setDate] = useState<any>([moment(), moment()]);
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoiceList[]>([]);
  const [invoiceType, setInvoiceType] = useState<string>(EnInvoiceType._IN);
  const instance = new EdxService();
  const onDateChange = (value: any) => {
    setDate([value[0], value[1]]);
    getInvoiceList(value[0], value[1], invoiceType);
  };
  const getInvoiceList = async (
    firstDate = date[0],
    secondDate = date[1],
    invType: string
  ) => {
    setLoading(true);
    let instanceType: "GetInvoice" | "GetSentInvoice" =
      invType === EnInvoiceType._IN ? "GetInvoice" : "GetSentInvoice";
    return await instance[instanceType](
      props.APIKey,
      firstDate.format("DD-MM-YYYY"),
      secondDate.format("DD-MM-YYYY")
    ).then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === 0) setInvoice(data.InvoiceList);
    });
  };

  useEffect(() => {
    getInvoiceList(date[0], date[1], invoiceType);
    return () => edxInstance._source.cancel();
  }, [invoiceType]);
  return (
    <>
      <h2 className="mb-4">{TranslateText("app.Invoice")}</h2>
      <Row gutter={ROW_GUTTER}>
        <Col span={24}>
          <Card
            title={
              <Select
                className="mr-2"
                defaultValue={invoiceType}
                onChange={(value) => setInvoiceType(value)}
              >
                <Select.Option value={EnInvoiceType._IN}>
                  Received Invoices
                </Select.Option>
                <Select.Option value={EnInvoiceType._OUT}>
                  Sent Invoices
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
              columns={invoiceTable(props, date, invoiceType)}
              className="no-border-last"
              dataSource={invoice}
              loading={loading}
              rowKey={"Number"}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default withRouter(Invoice);
