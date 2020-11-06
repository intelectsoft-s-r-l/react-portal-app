import { Menu } from "antd";
import { Avatar } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import React, { CSSProperties, useEffect } from "react";
import { IApps } from "./AppNav";
import "./app_list.scss";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
import { Link } from "react-router-dom";
const MenuItemStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
} as CSSProperties;
const AppNavGrid = (/* { apps }: { apps: IApps[] }, */ props) => {
    return (
        <>
            {props.apps &&
                props.apps.map((app) => (
                    <Menu.Item
                        key={app.Name}
                        {...props}
                        className="app-list__item"
                    >
                        <Link to={`${APP_PREFIX_PATH}/applications/${app.ID}`}>
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
