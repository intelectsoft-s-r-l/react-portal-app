import * as React from "react";
import { useState, useEffect } from "react";
import { AppstoreOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Empty, Tooltip } from "antd";
import IntlMessage from "../../../components/util-components/IntlMessage";
import AppNavGrid from "./AppNavGrid";
import Loading from "../../../components/shared-components/Loading";
import { IMarketAppList } from "../../../api/types.response";
import { API_APP_URL } from "../../../configs/AppConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import { IState } from "../../../redux/reducers";

const AppStoreNav = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [apps, setApps] = useState<IMarketAppList[]>([]);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const Token = useSelector((state: IState) => state.auth?.token);
  useEffect(() => {
    // TODO: Replace this with a new GetMarketAppList function,
    // that returns only Name and Logo of App
    if (menuIsOpen) {
      axios
        .get(`${API_APP_URL}/GetMarketAppList`, { params: { Token } })
        .then((response) => {
          const { data } = response;
          if (data && data.ErrorCode === 0) {
            setLoading(false);
            setApps(data.MarketAppList);
          }
        });
    }
  }, [menuIsOpen]);
  const menu = (
    <Menu
      style={{
        width: "330px",
        minHeight: loading ? "300px" : "auto",
      }}
    >
      {loading ? (
        <Loading align="center" />
      ) : apps.length > 0 ? (
        <AppNavGrid apps={apps ?? []} />
      ) : (
        <Empty />
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
          <Tooltip title={<IntlMessage id="header.applications" />}>
            <AppstoreOutlined className={"nav-icon"} />
          </Tooltip>
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
};

export default AppStoreNav;
