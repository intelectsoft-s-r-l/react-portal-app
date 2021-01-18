import * as React from "react";
import { useEffect, useState } from "react";
import { Badge, Card, Col, Row, Table, Tag } from "antd";
import { RouteComponentProps } from "react-router-dom";
import { SmsService } from "../../../../../../api";
import DonutChartWidget from "../../../../../../components/shared-components/DonutChartWidget";
import Flex from "../../../../../../components/shared-components/Flex";
import { COLORS } from "../../../../../../constants/ChartConstant";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import moment from "moment";
import StatisticWidget from "../../../../../../components/shared-components/StatisticWidget";
import Loading from "../../../../../../components/shared-components/Loading";
import { ISMSList } from "../../../../../../api/types.response";
import { ColumnsType } from "antd/es/table/interface";

interface ISmsDashboard extends RouteComponentProps {
  APIKey: string;
}

enum EnSmsType {
  INFO = 0,
  ADS = 1,
}

const tableColumns: ColumnsType<ISMSList> = [
  {
    title: "Created",
    dataIndex: "Created",
  },
  {
    title: "Sent date",
    dataIndex: "SentDate",
  },
  {
    title: "Message type",
    dataIndex: "MessageType",
    render: (_) => (
      <Tag
        className="text-capitalize"
        color={_.MessageType === EnSmsType.INFO ? "orange" : "cyan"}
      >
        {_.MessageType === EnSmsType.INFO ? "Informational" : "Advertisement"}
      </Tag>
    ),
  },
  {
    title: "State",
    dataIndex: "State",
  },
];
const SmsDashboard = (props: ISmsDashboard) => {
  const getSmsList = async () =>
    await new SmsService()
      .Info_GetDetailByPeriod(
        props.APIKey,
        moment("2019-01-01").valueOf() * 10000,
        moment("2021-01-01").valueOf() * 10000
      )
      .then((data) => {
        if (data && data.ErrorCode === 0) {
          setLoading(false);
          setSmsList(data.SMSList);
        }
      });
  const [smsInfo, setSmsInfo] = useState<any>([]);
  const [smsList, setSmsList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusData, setStatusData] = useState<any>([]);
  const statusColor = [COLORS[1], COLORS[2], COLORS[3], COLORS[6]];
  const statusLabels = ["Sent", "Failed", "Rejected", "Waiting for send"];
  const getSmsInfo = async () =>
    await new SmsService().Info_GetTotal(props.APIKey).then((data) => {
      if (data && data.ErrorCode === 0) {
        setStatusData([
          data.SentThisMonth,
          data.FailedDelivery,
          data.Rejected,
          data.WaitingForSend,
        ]);
        setSmsInfo([
          { title: "Today", value: data.SentToday },
          { title: "Week", value: data.SentThisWeek },
          { title: "Month", value: data.SentThisMonth },
        ]);
      }
    });

  useEffect(() => {
    getSmsInfo();
    getSmsList();
  }, []);
  const jointStatusData = () => {
    let arr: any = [];
    for (let i = 0; i < statusData.length; i++) {
      const data = statusData[i];
      const label = statusLabels[i];
      const color = statusColor[i];
      arr = [
        ...arr,
        {
          data,
          label,
          color,
        },
      ];
    }
    return arr;
  };

  if (loading) {
    return <Loading cover="content" />;
  }

  return (
    <>
      <h2 className="mb-4">Dashboard</h2>
      <h4 className="mb-4">Latest SMS Transactions</h4>
      <Row className="my-4" gutter={ROW_GUTTER}>
        <Col xs={24} sm={24} md={24} lg={24} xxl={16}>
          <Row gutter={ROW_GUTTER}>
            {smsInfo.map((elm: any, i: any) => (
              <Col xs={24} sm={24} md={24} lg={24} xl={8} key={i}>
                <StatisticWidget title={elm.title} value={elm.value} />
              </Col>
            ))}
          </Row>
          <Row gutter={ROW_GUTTER}>
            <Col span={24}>
              <Card title="SMS Transactions List">
                <Table
                  className="no-border-last"
                  columns={tableColumns}
                  dataSource={smsList}
                  rowKey="SentDate"
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xxl={8}>
          <DonutChartWidget
            series={statusData}
            labels={statusLabels}
            title="SMS Status"
            customOptions={{ colors: statusColor }}
            extra={
              <Row justify="center">
                <Col xs={20} sm={20} md={20} lg={24}>
                  <div className="mt-4 mx-auto" style={{ maxWidth: 200 }}>
                    {jointStatusData().map((elm: any) => (
                      <Flex
                        alignItems="center"
                        justifyContent="between"
                        className="mb-3"
                        key={elm.label}
                      >
                        <div>
                          <Badge color={elm.color} />
                          <span className="text-gray-light">{elm.label}</span>
                        </div>
                        <span className="font-weight-bold text-dark">
                          {elm.data}
                        </span>
                      </Flex>
                    ))}
                  </div>
                </Col>
              </Row>
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default SmsDashboard;
