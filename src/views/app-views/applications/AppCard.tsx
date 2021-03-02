import React, { useContext } from "react";
import {
  ExperimentOutlined,
  VerticalAlignBottomOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Card, Tag } from "antd";
import Flex from "../../../components/shared-components/Flex";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
import Avatar from "antd/lib/avatar/avatar";
import IntlMessage from "../../../components/util-components/IntlMessage";
import { WizardContext } from "./market/wizard/WizardContext";
import { EnStatusApp } from "./single-app-page";
import Button from "antd/es/button";
import Utils from "../../../utils";
import { useSelector } from "react-redux";
import { IState } from "../../../redux/reducers";
import { IMarketAppList } from "../../../api/app/types";

interface IAppCard {
  data: IMarketAppList;
  deactivateApp: (AppID: number, AppName: string) => void;
}
const AppCard = ({ data, deactivateApp }: IAppCard) => {
  const { dispatch } = useContext(WizardContext);
  const locale = useSelector((state: IState) => state.theme?.locale) ?? "en";
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
        {data.Status === EnStatusApp.DISABLED ? (
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

export default AppCard;
