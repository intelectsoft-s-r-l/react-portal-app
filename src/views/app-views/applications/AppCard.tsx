import React, { useContext } from "react";
import {
  ExperimentOutlined,
  VerticalAlignBottomOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Card, Tag } from "antd";
import Flex from "../../../components/shared-components/Flex";
import { Link, useHistory } from "react-router-dom";
import { APP_PREFIX_PATH, SMS_URL_VALIDATE } from "../../../configs/AppConfig";
import Avatar from "antd/lib/avatar/avatar";
import IntlMessage from "../../../components/util-components/IntlMessage";
import { WizardContext } from "./market/wizard/WizardContext";
import { EnApp, EnStatusApp } from "./single-app-page";
import Button from "antd/es/button";
import { useSelector } from "react-redux";
import { IState } from "../../../redux/reducers";
import { IMarketAppList } from "../../../api/app/types";
import Cookies from "js-cookie";

interface IAppCard {
  data: IMarketAppList;
  deactivateApp: (AppID: number, AppName: string) => void;
}
export function appRedirect(appUrl: string) {
  if (sessionStorage.getItem("c_id")) {
    window.open(
      `${appUrl}?token=${Cookies.get(
        `ManageToken_${sessionStorage.getItem("c_id")}`
      )}&company_id=${sessionStorage.getItem("c_id")}&isManage=true`
    );
  }
  window.open(`${appUrl}?token=${Cookies.get("Token")}`);
}
const AppCard = ({ data, deactivateApp }: IAppCard) => {
  const { dispatch } = useContext(WizardContext);
  const history = useHistory();
  const locale = useSelector((state: IState) => state.theme?.locale) ?? "en";
  const appLink = `${APP_PREFIX_PATH}/id/${data.AppType}/${data.Name.split(
    " "
  ).join("-")}`;
  return (
    <Card style={{ maxHeight: 368 }}>
      <Flex className="mb-3 " justifyContent="between">
        {data.AppType === EnApp.SMS && data.Status === EnStatusApp.ACTIVE ? (
          <div
            className="cursor-pointer app-avatar"
            onClick={() => {
              appRedirect(SMS_URL_VALIDATE);
            }}
          >
            <Avatar
              src={data.Photo}
              icon={<ExperimentOutlined />}
              shape="square"
              size={60}
            />
          </div>
        ) : (
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
        )}
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
        {data.AppType === EnApp.SMS && data.Status === EnStatusApp.ACTIVE ? (
          <h3
            onClick={() => {
              appRedirect(SMS_URL_VALIDATE);
            }}
            className="app-link
mb-0 cursor-pointer"
          >
            {data.Name}
          </h3>
        ) : (
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
        )}
        <p className="text-muted">By IntelectSoft</p>
        {/*<div style={{ minHeight: "70px" }}>
          {Utils.decodeBase64Locale(data.ShortDescription)[locale] ?? ""}
        </div> */}
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
