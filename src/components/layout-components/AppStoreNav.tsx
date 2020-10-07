import * as React from "react";
import { AppstoreOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Empty, Tooltip } from "antd";
import IntlMessage from "../util-components/IntlMessage";

const AppStoreNav = () => {
  const menu = (
    <Menu>
      <Menu.Item>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
      </Menu.Item>
    </Menu>
    );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement={"bottomRight"}>
      <Menu mode={"horizontal"}>
        <Menu.Item>
          <Tooltip title={<IntlMessage id={"header.applications"} />}>
            <AppstoreOutlined className={"nav-icon"} />
          </Tooltip>
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
};

export default AppStoreNav;
