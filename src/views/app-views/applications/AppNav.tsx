import * as React from "react";
import { useState, useEffect } from "react";
import { AppstoreOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Empty, Tooltip } from "antd";
import IntlMessage from "../../../components/util-components/IntlMessage";
import AppNavGrid from "./AppNavGrid";
import Loading from "../../../components/shared-components/Loading";
import { IShortMarketAppList } from "../../../api/app/app.types";
import { AppService } from "../../../api/app";

const AppStoreNav = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [apps, setApps] = useState<IShortMarketAppList[]>([]);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const instance = new AppService();
  useEffect(() => {
    if (menuIsOpen) {
      instance.GetMarketAppListShort().then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === 0) setApps(data.AppList);
      });
    }
  }, [menuIsOpen]);
  const menu = (
    <Menu
      style={{
        maxWidth: "350px",
        minWidth: loading ? "350px" : "auto",
        maxHeight: "500px",
        minHeight: loading ? "300px" : "auto",
        overflow: "auto",
      }}
    >
      {loading ? (
        <Loading align="center" />
      ) : apps.length > 0 ? (
        <AppNavGrid apps={apps ?? []} />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={["click"]}
      placement={"bottomRight"}
      onVisibleChange={(visible) => {
        if (visible) {
          setMenuIsOpen(true);
        } else {
          setTimeout(() => {
            setMenuIsOpen(false);
            setLoading(true);
            setApps([]);
          }, 200);
        }
      }}
    >
      <Menu mode={"horizontal"}>
        <Menu.Item>
          <Tooltip
            title={<IntlMessage id="header.applications" />}
            placement="bottom"
          >
            <AppstoreOutlined className={"nav-icon"} />
          </Tooltip>
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
};

export default AppStoreNav;
