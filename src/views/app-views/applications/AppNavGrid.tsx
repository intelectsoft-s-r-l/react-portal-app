import { Menu } from "antd";
import { Avatar } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import React from "react";
import "./app_list.scss";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
import { Link, NavLink } from "react-router-dom";
const AppNavGrid = (props) => {
    return (
        <>
            {props.apps &&
                props.apps.map((app) => (
                    <Menu.Item
                        key={app.Name}
                        className="app-list__item"
                        {...props}
                    >
                        <NavLink
                            to={`${APP_PREFIX_PATH}/applications/${app.AppType}`}
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
                        </NavLink>
                    </Menu.Item>
                ))}
        </>
    );
};

export default AppNavGrid;
