import React, { Component } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { Drawer, Menu } from "antd";
import { connect } from "react-redux";
import ThemeConfigurator from "./ThemeConfigurator"
import IntlMessage from "../util-components/IntlMessage"
import { Tooltip } from "antd"

class NavPanel extends Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <>
        <Menu mode="horizontal">
          <Menu.Item onClick={this.showDrawer}>
            <Tooltip title={<IntlMessage id={"sidenav.settings"}/>}>
            <SettingOutlined className="nav-icon mr-0" />
            </Tooltip>
          </Menu.Item>
        </Menu>
        <Drawer
          title="Theme Config"
          placement="right"
          width={350}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <ThemeConfigurator/>
        </Drawer>
      </>
    );
  }
}

const mapStateToProps = ({ theme }) => {
  const { locale } = theme;
  return { locale };
};

export default connect(mapStateToProps)(NavPanel);
