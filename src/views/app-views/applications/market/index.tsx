import React, {
  SetStateAction,
  Dispatch,
  useEffect,
  useState,
  useContext,
  useReducer,
} from "react";
import {
  Button,
  Row,
  Col,
  Tag,
  Avatar,
  Card,
  Modal,
  Empty,
  Input,
  message,
} from "antd";
import {
  VerticalAlignBottomOutlined,
  SearchOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Flex from "../../../../components/shared-components/Flex";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../../configs/AppConfig";
import { useSelector } from "react-redux";
import Loading from "../../../../components/shared-components/Loading";
import { AppService } from "../../../../api/app";
import InstallWizard from "./wizard";
import { MarketContext } from "./MarketContext";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import Utils from "../../../../utils";
import TranslateText from "../../../../utils/translate";
import { IState } from "../../../../redux/reducers";
import { IMarketAppList } from "../../../../api/app/types";
import "../applications.scss";
import { DONE } from "../../../../constants/Messages";
import wizardReducer, { wizardState } from "./wizard/wizardReducer";

interface IGridItem {
  data: IMarketAppList;
}
const GridItem = ({ data }: IGridItem) => {
  const locale = useSelector((state: IState) => state["theme"]!.locale) ?? "en";
  const { state, dispatch, getMarketApps } = useContext(MarketContext);
  const deactivateApp = (AppID: number, AppName: string) => {
    Modal.confirm({
      title: `${TranslateText("app.uninstall.title")} ${AppName}?`,
      onOk: async () => {
        return await new AppService()
          .DeactivateApp(AppID)
          .then(async (data: any) => {
            if (data && data.ErrorCode === 0) {
              await getMarketApps();
              message.success({ content: TranslateText(DONE), duration: 1 });
            }
          });
      },
      onCancel: () => {},
    });
  };
  return (
    <Card style={{ maxHeight: 368 }}>
      <Flex className="mb-3 " justifyContent="between">
        <Link
          to={`${APP_PREFIX_PATH}/id/${data.AppType}/${data.Name.split(
            " "
          ).join("-")}`}
        >
          <div className="cursor-pointer app-avatar">
            <Avatar
              src={data.Photo}
              icon={<ExperimentOutlined />}
              shape="square"
              size={60}
            />
          </div>
        </Link>
        {data.Status === 0 ? (
          <Tag
            className="text-capitalize cursor-pointer"
            color="default"
            onClick={() => {
              dispatch({ type: "SHOW_WIZARD" });
              dispatch({ type: "SET_APP", payload: data });
            }}
          >
            <VerticalAlignBottomOutlined />
            <span
              className="ml-2
  font-weight-semibold"
            >
              <IntlMessage id={"app.status.NotInstalled"} />
            </span>
          </Tag>
        ) : (
          <Tag className="text-capitalize" color="cyan">
            <CheckCircleOutlined />
            <span className="ml-2 font-weight-semibold">
              <IntlMessage id={"app.status.Installed"} />
            </span>
          </Tag>
        )}
      </Flex>
      <div>
        <Link
          to={`${APP_PREFIX_PATH}/id/${data.AppType}/${data.Name.split(
            " "
          ).join("-")}`}
        >
          <h3
            className="app-link
mb-0 cursor-pointer"
          >
            {data.Name}
          </h3>
        </Link>
        <p className="text-muted">By IntelectSoft</p>
        <div style={{ minHeight: "70px" }}>
          {Utils.decodeBase64Locale(data.ShortDescription)[locale] ?? ""}
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
const Market = () => {
  const instance = new AppService();
  const [apps, setApps] = useState<IMarketAppList[]>([]);
  const [appsToSearch, setAppsToSearch] = useState<IMarketAppList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [state, dispatch] = useReducer(wizardReducer, wizardState);
  const getMarketApps = async () => {
    return instance.GetMarketAppList().then((data) => {
      if (data && data.ErrorCode === 0) {
        setLoading(false);
        const evaluatedArr = Utils.sortData(data.MarketAppList, "ID");
        setApps(evaluatedArr);
        dispatch({ type: "HIDE_LOADING" });
        setAppsToSearch(evaluatedArr);
      }
    });
  };
  useEffect(() => {
    getMarketApps();
    return () => instance._source.cancel();
  }, []);

  useEffect(() => {
    // Cleanup installation state after closing the installation modal
    if (!state.visibleModal) {
      setTimeout(() => {
        dispatch("");
      }, 250);
    }
  }, [state.visibleModal]);

  return (
    <>
      <MarketContext.Provider value={{ state, dispatch, getMarketApps }}>
        <InstallWizard />
        {loading ? (
          <Loading cover="content" />
        ) : (
          <div
            className={`my-4 
                    container-fluid`}
          >
            <Col lg={4} md={8} className="mb-4">
              <Input
                type="search"
                prefix={<SearchOutlined />}
                placeholder={TranslateText("app.Search")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.currentTarget!.value!;
                  const searchArray = value ? apps : appsToSearch;
                  const data = Utils.wildCardSearch(searchArray, value);
                  setApps(data);
                }}
              />
            </Col>
            <Row gutter={16}>
              {apps.length > 0 && !loading ? (
                apps.map((elm) => (
                  <Col
                    xs={24}
                    sm={24}
                    lg={12}
                    xl={8}
                    xxl={6}
                    key={elm["AppType"]}
                  >
                    <GridItem data={elm} />
                  </Col>
                ))
              ) : (
                <Flex justifyContent="center" className="w-100">
                  <Empty />
                </Flex>
              )}
            </Row>
          </div>
        )}
      </MarketContext.Provider>
    </>
  );
};

export default Market;
