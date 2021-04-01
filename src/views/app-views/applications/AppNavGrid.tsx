import React from "react";
import { Menu } from "antd";
import { Avatar } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import { APP_PREFIX_PATH, SMS_URL_VALIDATE } from "../../../configs/AppConfig";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { IShortMarketAppList } from "../../../api/app/types";
import { MenuItemProps } from "antd/lib/menu/MenuItem";
import "./applications.scss";
import { EnApp, EnStatusApp } from "./single-app-page";
import { appRedirect } from "./AppCard";

interface IAppNavGrid extends MenuItemProps, RouteComponentProps {
  apps: IShortMarketAppList[];
}

const AppNavGrid = (props: IAppNavGrid) => {
  return (
    <>
      {props.apps.map((app) => (
        <Menu.Item key={app.AppType} {...props} className="app-list__item">
          {app.AppType === EnApp.SMS && app.Status === EnStatusApp.ACTIVE ? (
            <>
              <div
                className="text-center"
                onClick={() => appRedirect(SMS_URL_VALIDATE)}
              >
                <Avatar
                  src={app.Photo}
                  icon={<ExperimentOutlined />}
                  shape="square"
                  alt={app.Name}
                  style={{ marginBottom: "10px" }}
                />
              </div>
              <p className="text-center">{app.Name}</p>
            </>
          ) : (
            <Link
              to={`${APP_PREFIX_PATH}/id/${app.AppType}/${app.Name.split(
                " "
              ).join("-")}`}
            >
              <div className="text-center">
                <Avatar
                  src={app.Photo}
                  icon={<ExperimentOutlined />}
                  shape="square"
                  alt={app.Name}
                  style={{ marginBottom: "10px" }}
                />
              </div>
              <p className="text-center">{app.Name}</p>
            </Link>
          )}
        </Menu.Item>
      ))}
    </>
  );
};

export default withRouter(AppNavGrid);
