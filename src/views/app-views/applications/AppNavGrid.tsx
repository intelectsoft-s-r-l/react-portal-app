import { Menu } from "antd";
import { Avatar } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import React from "react";
import "./applications.scss";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
import { Link } from "react-router-dom";
const AppNavGrid = (props: any) => {
  return (
    <>
      {props.apps &&
        props.apps.map((app: any) => (
          <Menu.Item key={app.Name} {...props} className="app-list__item">
            <Link to={`${APP_PREFIX_PATH}/id/${app.AppType}`}>
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
          </Menu.Item>
        ))}
    </>
  );
};

export default AppNavGrid;
