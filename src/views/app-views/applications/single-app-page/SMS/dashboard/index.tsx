import * as React from "react";
import { useEffect, useState } from "react";
import { Badge, Card, Col, DatePicker, Row, Table, Tag } from "antd";
import { RouteComponentProps } from "react-router-dom";
import { SmsService } from "../../../../../../api";
import DonutChartWidget from "../../../../../../components/shared-components/DonutChartWidget";
import Flex from "../../../../../../components/shared-components/Flex";
import { COLORS } from "../../../../../../constants/ChartConstant";
import { ROW_GUTTER } from "../../../../../../constants/ThemeConstant";
import moment, { MomentInput } from "moment";
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

enum EnSmsState {
  Pending = 0,
  DeliverySuccessful = 1,
  FailedDelivery = 2,
  MessageBuffered = 3,
  AcceptedSmsc = 8,
  RejectedSmsc = 16,
  DeliveryToBulkSMS = 100,
}

const tableColumns: ColumnsType<ISMSList> = [
  {
    title: "Phone",
    dataIndex: "Phone",
    render: (Phone) => <span>{Phone}</span>,
  },
  {
    title: "Sent date",
    dataIndex: "SentDate",
    render: (SentDate) => (
      <span>{moment.unix(SentDate.slice(6, 16)).format("DD-MM-YYYY")}</span>
    ),
  },
  {
    title: "Message type",
    dataIndex: "MessageType",
    render: (MessageType) => (
      <Tag
        className="text-capitalize"
        color={MessageType === EnSmsType.INFO ? "orange" : "cyan"}
      >
        {MessageType === EnSmsType.INFO ? "Informational" : "Advertisement"}
      </Tag>
    ),
  },
  {
    title: "State",
    dataIndex: "State",
    render: (State) => (
      <Tag className="text-capitalize" color={"gray"}>
        {State === EnSmsState.DeliveryToBulkSMS
          ? "Bulk delivery"
          : State === EnSmsState.FailedDelivery
          ? "Failed delivery"
          : State === EnSmsState.RejectedSmsc
          ? "Rejected"
          : State === EnSmsState.AcceptedSmsc
          ? "Accepted"
          : State === EnSmsState.MessageBuffered
          ? "Buffered"
          : State === EnSmsState.Pending
          ? "Pending"
          : "Success"}
      </Tag>
    ),
  },
];
const SmsDashboard = (props: ISmsDashboard) => {
  const instance = new SmsService();
  const [date, setDate] = useState<any>([
    moment().clone().startOf("month"),
    moment().clone().endOf("month"),
  ]);

  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [smsInfo, setSmsInfo] = useState<{ title: string; value: number }[]>(
    []
  );
  const [smsList, setSmsList] = useState<ISMSList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusData, setStatusData] = useState<any>([]);
  const statusColor = [COLORS[1], COLORS[2], COLORS[3], COLORS[6]];
  const statusLabels = ["Sent", "Failed", "Rejected", "Waiting for send"];
  const onChange = async (value: any) => {
    setDate([value[0], value[1]]);
    setTableLoading(true);
    getSmsList(value[0].format("DD-MM-YYYY"), value[1].format("DD-MM-YYYY"));
  };
  const getSmsList = async (
    // give default values
    firstDate = date[0].format("DD-MM-YYYY"),
    secondDate = date[1].format("DD-MM-YYYY")
  ) => {
    return await instance
      .Info_GetDetailByPeriod(props.APIKey, firstDate, secondDate)
      .then((data) => {
        if (data && data.ErrorCode === 0) {
          setTableLoading(false);
          setSmsList(data.SMSList);
        }
      });
  };
  const getSmsInfo = async () => {
    return instance.Info_GetTotal(props.APIKey).then((data) => {
      if (data && data.ErrorCode === 0) {
        setLoading(false);
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
  };
  useEffect(() => {
    getSmsInfo();
    return () => instance._source.cancel();
  }, []);
  useEffect(() => {
    getSmsList();
    return () => instance._source.cancel();
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
              <Card
                title="SMS Transactions List"
                extra={
                  <DatePicker.RangePicker
                    format={"DD-MM-YYYY"}
                    defaultValue={date}
                    onChange={onChange}
                  />
                }
              >
                <Table
                  className="no-border-last"
                  columns={tableColumns}
                  dataSource={smsList}
                  rowKey="SentDate"
                  loading={tableLoading}
                  onRow={(record) => {
                    return {
                      onMouseOver: (event) => {
                        event.currentTarget.setAttribute(
                          "title",
                          "Message: " + record.Message
                        );
                      },
                    };
                  }}
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
