import React, { useEffect, useState } from "react";
import { Card, Col, Empty, Row, Tag } from "antd";
import Flex from "../../../../components/shared-components/Flex";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { IMarketAppList, IPackages } from "../../../../api/app/app.types";
import Loading from "../../../../components/shared-components/Loading";
import { AppService } from "../../../../api/app";
import TranslateText from "../../../../utils/translate";

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
            {packages.Status === 1
              ? TranslateText("app.Packages.Active")
              : TranslateText("app.Packages.NotActive")}
          </span>
        </Tag>
      </Flex>
    </>
  );
};

const ItemFooter = ({ packages }: { packages: IPackages }) => (
  <div>
    <h5>{TranslateText("app.Packages.Pricing")}</h5>
    <Flex justifyContent="center">
      <Card className="mt-3">
        <div>
          {TranslateText("app.Packages.From")} {packages.MinValue}{" "}
          {TranslateText("app.Packages.To")} {packages.MaxValue}{" "}
          {TranslateText("app.Packages.For")} {packages.Price} MDL
        </div>
      </Card>
    </Flex>
  </div>
);
const CardItem = ({ packages }: { packages: IPackages }) => {
  return (
    <Card style={{ height: "220px", maxWidth: "350px" }}>
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
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    instance.GetMarketAppList().then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === 0) {
        const currentPackages = data.MarketAppList.find(
          (app) => app.AppType == currentApp!.AppType
        );
        setPackages(currentPackages?.Packages ?? []);
      }
    });
  }, []);

  if (loading) return <Loading />;
  if (!packages) return <Empty />;
  return (
    <>
      <h2 className="mb-4">
        <IntlMessage id="app.Packages" />
      </h2>
      <div className="my-4 container-fluid">
        <Row gutter={16}>
          {packages.length > 0 &&
            packages
              .sort((a, b) => a.SortIndex - b.SortIndex)
              .map((elm) => (
                <Col
                  xs={24}
                  sm={24}
                  lg={8}
                  xl={8}
                  xxl={6}
                  key={elm["ID"]}
                  className="m-3"
                >
                  <CardItem packages={elm} />
                </Col>
              ))}
        </Row>
      </div>
    </>
  );
};
export default Packages;
