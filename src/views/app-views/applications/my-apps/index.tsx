import { Modal, Avatar, Card, Col, Empty, Row, Tag, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../../configs/AppConfig";
import { CheckCircleOutlined, ExperimentOutlined } from "@ant-design/icons";
import Flex from "../../../../components/shared-components/Flex";
import Loading from "../../../../components/shared-components/Loading";
import { AppService } from "../../../../api";
import Utils from "../../../../utils";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { IState } from "../../../../redux/reducers";
import WithStringTranslate from "../../../../utils/translate";
import { ILocale, IMarketAppList } from "../../../../api/types.response";

const GridItem = ({ deactivateApp, data }: any) => {
  const [shortDesc, setShortDesc] = useState<Partial<ILocale>>({});
  const locale = useSelector((state: IState) => state["theme"]!.locale) ?? "en";
  useEffect(() => {
    try {
      setShortDesc(JSON.parse(window.atob(data.ShortDescription.toString())));
    } catch {
      setShortDesc({ en: "", ru: "", ro: "" });
    }
  }, []);
  return (
    <Card style={{ maxHeight: 368 }}>
      <Flex className="mb-3 " justifyContent="between">
        <Link to={`${APP_PREFIX_PATH}/applications/${data.AppType}`}>
          <div className="cursor-pointer app-avatar">
            <Avatar
              src={data.Photo}
              icon={<ExperimentOutlined />}
              shape="square"
              size={60}
            />
          </div>
        </Link>
        <Tag className="text-capitalize" color="cyan">
          <CheckCircleOutlined />
          <span className="ml-2 font-weight-semibold">
            <IntlMessage id={"app.status.Installed"} />
          </span>
        </Tag>
      </Flex>
      <div>
        <Link to={`${APP_PREFIX_PATH}/applications/${data.AppType}`}>
          <h3 className="app-link mb-0 cursor-pointer ">{data.Name}</h3>
        </Link>
        <p className="text-muted">By IntelectSoft</p>
        <div style={{ minHeight: "70px" }}>
          {shortDesc ? shortDesc[locale] : null}
        </div>
      </div>
      <Flex justifyContent="between" alignItems="center">
        <div className="text-muted">Free</div>
        <Button
          onClick={() => deactivateApp(data.ID, data.Name)}
          danger
          type={"link"}
          style={{
            visibility: data.Status === 1 ? "visible" : "hidden",
          }}
        >
          <IntlMessage id={"app.Delete"} />
        </Button>
      </Flex>
    </Card>
  );
};
const MyAppList = () => {
  const [apps, setApps] = useState<IMarketAppList[]>([]);
  const { confirm } = Modal;
  const [loading, setLoading] = useState<boolean>(true);
  const getMarketAppList = async () => {
    return new AppService().GetMarketAppList().then((data: any) => {
      setLoading(false);
      if (data) {
        const { ErrorCode, MarketAppList } = data;
        if (ErrorCode === 0) {
          const activeApps = MarketAppList.filter(
            (marketApp: IMarketAppList) => marketApp.Status !== 0
          );
          setApps(Utils.sortData(activeApps, "ID"));
        }
      }
    });
  };
  useEffect(() => {
    getMarketAppList();
  }, []);

  const deactivateApp = (AppID: number, AppName: string) => {
    confirm({
      title: `${WithStringTranslate("app.uninstall.title")} ${AppName}?`,
      onOk: () => {
        return new Promise((resolve) => {
          setTimeout(
            () =>
              resolve(
                new AppService()
                  .DeactivateApp(AppID)
                  .then(async (data: any) => {
                    if (data) {
                      if (data.ErrorCode === 0) await getMarketAppList();
                    }
                  })
              ),
            1000
          );
        });
      },
      onCancel: () => { },
    });
  };

  if (loading) {
    return <Loading cover="content" />;
  }

  return (
    <div
      className={`my-4 
                    container-fluid`}
    >
      <Row gutter={16}>
        {apps.length > 0 ? (
          apps.map((elm) => (
            <Col xs={24} sm={24} lg={12} xl={8} xxl={6} key={elm["AppType"]}>
              <GridItem
                deactivateApp={deactivateApp}
                data={elm}
                key={elm["AppType"]}
              />
            </Col>
          ))
        ) : (
            <Flex justifyContent="center" className="w-100">
              <Empty />
            </Flex>
          )}
      </Row>
    </div>
  );
};

export default MyAppList;
