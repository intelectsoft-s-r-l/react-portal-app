import * as React from "react";
import { useState, useEffect } from "react";
import { DiscountService } from "../../../../../../api";
import TranslateText from "../../../../../../utils/translate";
import moment from "moment";
import { IDiscountGetInfo } from "../../../../../../api/types.response";
import { Col, Row } from "antd";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import StatisticWidget from "../../../../../../components/shared-components/StatisticWidget";

const DiscountDashboard = (props: any) => {
  const { APIKey } = props;
  const instance = new DiscountService();
  const [date, setDate] = useState<any>([
    moment().clone().startOf("month"),
    moment().clone().endOf("month"),
  ]);
  const [info, setInfo] = useState<IDiscountGetInfo>({
    Cashback: 0,
    Validation: 0,
  });
  const getInfo = (
    firstDate = date[0].format("DD-MM-YYYY"),
    secondDate = date[1].format("DD-MM-YYYY")
  ) =>
    instance.GetInfo(APIKey, firstDate, secondDate).then((data) => {
      if (data && data.ErrorCode === 0)
        setInfo({ Cashback: data.Cashback, Validation: data.Validation });
    });

  useEffect(() => {
    getInfo();
    return () => instance._source.cancel();
  }, []);

  return (
    <>
      <h2 className="mb-4">{TranslateText("app.Dashboard")}</h2>
      <h4 className="mb-4">MyDiscount Info</h4>
      <Row gutter={ROW_GUTTER}>
        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
          <StatisticWidget title={"Cashback"} value={info.Cashback} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
          <StatisticWidget title={"Validation"} value={info.Validation} />
        </Col>
      </Row>
    </>
  );
};
export default DiscountDashboard;
