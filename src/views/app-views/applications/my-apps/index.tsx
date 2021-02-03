import React, { useEffect, useState } from "react";
import { Modal, Avatar, Card, Col, Empty, Row, Tag, Button } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../../configs/AppConfig";
import { CheckCircleOutlined, ExperimentOutlined } from "@ant-design/icons";
import Flex from "../../../../components/shared-components/Flex";
import Loading from "../../../../components/shared-components/Loading";
import { AppService } from "../../../../api/app";
import Utils from "../../../../utils";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { IState } from "../../../../redux/reducers";
import TranslateText from "../../../../utils/translate";
import { ILocale, IMarketAppList } from "../../../../api/app/app.types";

interface IGridItem {
  deactivateApp: (ID: number, Name: string) => void;
  data: IMarketAppList;
}
const GridItem = ({ deactivateApp, data }: IGridItem) => {
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
        <Link to={`${APP_PREFIX_PATH}/id/${data.AppType}`}>
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
        <Link to={`${APP_PREFIX_PATH}/id/${data.AppType}`}>
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
  const instance = new AppService();
  const [apps, setApps] = useState<IMarketAppList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { confirm } = Modal;
  const getMarketAppList = async () => {
    return instance.GetMarketAppList().then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === 0) {
        const activeApps = data.MarketAppList.filter(
          (marketApp: IMarketAppList) => marketApp.Status !== 0
        );
        setApps(Utils.sortData(activeApps, "ID"));
      }
    });
  };

  useEffect(() => {
    getMarketAppList();
    return () => instance._source.cancel();
  }, []);

  const deactivateApp = (AppID: number, AppName: string) => {
    confirm({
      title: `${TranslateText("app.uninstall.title")} ${AppName}?`,
      onOk: async () => {
        return await instance.DeactivateApp(AppID).then(async (data) => {
          if (data && data.ErrorCode === 0) await getMarketAppList();
        });
      },
      onCancel: () => {},
    });
  };

  if (loading) {
    return <Loading cover="content" />;
  }

  return (
    <div className={`my-4 container-fluid`}>
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
