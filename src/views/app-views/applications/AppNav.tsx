import * as React from "react";
import { useState } from "react";
import { AppstoreOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Empty, Tooltip } from "antd";
import IntlMessage from "../../../components/util-components/IntlMessage";
import AppNavGrid from "./AppNavGrid";
import { useSelector } from "react-redux";
import Loading from "../../../components/shared-components/Loading";
import { ClientApi } from "../../../api";
import { IMarketAppList } from "./AppInterface";
import { IState } from "../../../redux/reducers";

const AppStoreNav = () => {
    const loading = useSelector((state: IState) => state["auth"]!.loading);
    const [apps, setApps] = useState<IMarketAppList[]>([]);
    const renderApps = () => {
        return new ClientApi().GetMarketAppList().then((data: any) => {
            if (data) {
                setApps([...data.MarketAppList]);
            }
        });
    };
    const menu = (
        <Menu style={{ width: "330px", minHeight: loading ? "300px" : "auto" }}>
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
