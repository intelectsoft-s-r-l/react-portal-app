import * as React from "react";
import { useState, useEffect } from "react";
import { Card, Col, DatePicker, Row, Table } from "antd";
import { RouteComponentProps } from "react-router-dom";
import { EdxService } from "../../../../../../../api/edx";
import TranslateText from "../../../../../../../utils/translate";
import { invoiceTable } from "./InvoiceTable";
import moment from "moment";
import { ROW_GUTTER } from "../../../../../../../constants/ThemeConstant";
import { InvoiceList } from "../../../../../../../api/edx/edx.types";
interface Invoice extends RouteComponentProps {
  APIKey: string;
}
const Invoice = (props: Invoice) => {
  const { APIKey } = props;
  const edxInstance = new EdxService();
  const [date, setDate] = useState<any>([
    moment().clone().startOf("month"),
    moment().clone().endOf("month"),
  ]);
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoiceList[]>([]);
  const onDateChange = (value: any) => {
    setDate([value[0], value[1]]);
    getInvoiceList(value[0], value[1]);
  };
  const getInvoiceList = async (firstDate = date[0], secondDate = date[1]) => {
    setLoading(true);
    return await edxInstance
      .GetInvoice(
        APIKey,
        firstDate.format("DD-MM-YYYY"),
        secondDate.format("DD-MM-YYYY")
      )
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === 0) setInvoice(data.InvoiceList);
      });
  };

  useEffect(() => {
    getInvoiceList();
    return () => edxInstance._source.cancel();
  }, []);
  return (
    <>
      <h2 className="mb-4">{TranslateText("app.Invoice")}</h2>
      <Row gutter={ROW_GUTTER}>
        <Col span={24}>
          <Card
            title={"Invoice list"}
            extra={
              <DatePicker.RangePicker
                format={"DD-MM-YYYY"}
                defaultValue={date}
                onChange={onDateChange}
              />
            }
          >
            <Table
              columns={invoiceTable()}
              className="no-border-last"
              dataSource={invoice}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default Invoice;
