import * as React from "react";
import { useState } from "react";
import { AppstoreOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Empty, Tooltip, message } from "antd";
import IntlMessage from "../../../components/util-components/IntlMessage";
import AppNavGrid from "./AppNavGrid";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/shared-components/Loading";
import { ClientApi } from "../../../api";

const AppStoreNav = () => {
    // const [apps, setApps] = useState<IApps[]>([]);
    const dispatch = useDispatch();
    const loading = useSelector((state) => state["auth"].loading);
    const [apps, setApps] = useState<any>([]);
    // const apps: IApps[] = useSelector((state) => state["apps"]);
    const renderApps = () => {
        return new ClientApi().GetMarketAppList().then((data: any) => {
            setApps([...data.MarketAppList]);
        });
    };
    const menu = (
        <Menu style={{ width: "330px", minHeight: loading && "300px" }}>
            {loading ? (
                <Loading cover="content" align="center" />
            ) : (
                <AppNavGrid apps={apps} />
            )}
            {apps.length > 0 || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={["click"]} placement={"bottomRight"}>
            <Menu mode={"horizontal"} onClick={() => renderApps()}>
                <Menu.Item>
                    <Tooltip title={<IntlMessage id="header.applications" />}>
                        <AppstoreOutlined className={"nav-icon"} />
                    </Tooltip>
                </Menu.Item>
            </Menu>
        </Dropdown>
    );
};

export default AppStoreNav;
