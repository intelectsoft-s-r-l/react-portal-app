import { Card, Col, Empty, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import Flex from "../../../../components/shared-components/Flex";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { IMarketAppList, IPackages } from "../../../../api/types.response";
import Loading from "../../../../components/shared-components/Loading";
import { AppService } from "../../../../api";
import { RouteComponentProps } from "react-router-dom";
import { IState } from "../../../../redux/reducers";
import { useSelector } from "react-redux";

const ItemHeader = ({ packages }: { packages: IPackages }) => {
  return (
    <>
      <Flex>
        <h4 className="mb-0">{packages.Name}</h4>
        <Tag
          className="text-capitalize ml-2"
          color={packages.Status === 1 ? "cyan" : "red"}
        >
          {packages.Status === 1 ? (
            <CheckCircleOutlined />
          ) : (
            <ClockCircleOutlined />
          )}
          <span className="ml-2 font-weight-semibold">
            {packages.Status === 1 ? "Active" : "Not Active"}
          </span>
        </Tag>
      </Flex>
    </>
  );
};

const ItemFooter = ({ packages }: { packages: IPackages }) => (
  <div>
    <h5>Pricing</h5>
    <Flex justifyContent="center">
      <Card className="mt-3">
        <div>
          From {packages.MinValue} to {packages.MaxValue} for {packages.Price}{" "}
          MDL
        </div>
      </Card>
    </Flex>
  </div>
);
const CardItem = ({ packages }: { packages: IPackages }) => {
  return (
    <Card>
      <ItemHeader packages={packages} />
      <div className="mt-2">
        <ItemFooter packages={packages} />
      </div>
    </Card>
  );
};
const Packages = ({ currentApp }: { currentApp: Partial<IMarketAppList> }) => {
  // API instance
  const instance = new AppService();
  const [packages, setPackages] = useState<IPackages[]>([]);
  const loading = useSelector((state: IState) => state.auth?.loading);
  useEffect(() => {
    instance.GetMarketAppList().then((data) => {
      if (data && data.ErrorCode === 0) {
        const currentPackages = data.MarketAppList.find(
          (app) => app.AppType == currentApp!.AppType
        );
        setPackages(currentPackages?.Packages ?? []);
      }
    });
  }, []);

  if (loading) return <Loading />;
  return (
    <>
      <h2 className="mb-4">
        <IntlMessage id="app.Packages" />
      </h2>
      <div className="my-4 container-fluid">
        <Row gutter={16}>
          {packages.length > 0 ? (
            packages
              .sort((a, b) => a.SortIndex - b.SortIndex)
              .map((elm) => (
                <Col xs={24} sm={24} lg={8} xl={8} xxl={6} key={elm["ID"]}>
                  <CardItem packages={elm} />
                </Col>
              ))
          ) : (
            <Flex className="w-100" justifyContent="center">
              <Empty />
            </Flex>
          )}
        </Row>
      </div>
    </>
  );
};
export default Packages;
