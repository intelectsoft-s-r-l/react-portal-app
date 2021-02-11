import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Menu, Layout } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Logo from "./Logo";
import NavPanel from "./NavPanel";
import NavSearch from "./NavSearch";
import {
  toggleCollapsedNav,
  onMobileNavToggle,
} from "../../redux/actions/Theme";
import {
  NAV_TYPE_TOP,
  SIDE_NAV_COLLAPSED_WIDTH,
  SIDE_NAV_WIDTH,
} from "../../constants/ThemeConstant";
import utils from "../../utils";
import NavProfile from "./NavProfile";
import AppStoreNav from "../../views/app-views/applications/AppNav";
import { ITheme } from "../../redux/reducers/Theme";
import { IState } from "../../redux/reducers";
import { IAccount } from "../../redux/reducers/Account";
import { AppService } from "../../api/app";

const { Header } = Layout;

const HeaderNav = (props: any) => {
  const {
    navCollapsed,
    mobileNav,
    navType,
    headerNavColor,
    toggleCollapsedNav,
    onMobileNavToggle,
    isMobile,
    history,
    CompanyID,
    Company,
  } = props;
  const [searchActive, setSearchActive] = useState(false);

  const onSearchClose = () => {
    setSearchActive(false);
  };
  const onToggle = () => {
    if (!isMobile) {
      toggleCollapsedNav(!navCollapsed);
    } else {
      onMobileNavToggle(!mobileNav);
    }
  };

  const isNavTop = navType === NAV_TYPE_TOP;
  const mode = utils.getColorContrast(headerNavColor);
  const getNavWidth = () => {
    if (isNavTop || isMobile) {
      return "0px";
    }
    if (navCollapsed) {
      return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
    } else {
      return `${SIDE_NAV_WIDTH}px`;
    }
  };
  return (
    <Header
      className={`app-header ${mode}`}
      style={{ backgroundColor: headerNavColor }}
    >
      <div className={`app-header-wrapper ${isNavTop ? "layout-top-nav" : ""}`}>
        <Logo logoType={mode} />
        <div
          className="nav"
          style={{
            width: `calc(100% - ${getNavWidth()})`,
          }}
        >
          <div className="nav-left">
            <Menu mode="horizontal">
              {isNavTop && !isMobile ? null : (
                <Menu.Item
                  key="0"
                  onClick={() => {
                    onToggle();
                  }}
                >
                  {navCollapsed || isMobile ? (
                    <MenuUnfoldOutlined className="nav-icon" />
                  ) : (
                    <MenuFoldOutlined className="nav-icon" />
                  )}
                </Menu.Item>
              )}
            </Menu>
          </div>
          <div className="nav-left">
            {!isNavTop && CompanyID === 1 && Company !== "INTELECTSOFT SRL" ? (
              <div
                className={`text-${
                  headerNavColor === "#ffffff" ? "dark" : "white"
                } px-5`}
                style={{ fontSize: "20px" }}
              >
                {`ATENTIE! Administrati: ${Company}`}
              </div>
            ) : null}
          </div>
          <div className="nav-right">
            <AppStoreNav />
            <NavPanel />
            <NavProfile />
          </div>
          <NavSearch active={searchActive} close={onSearchClose} />
        </div>
      </div>
    </Header>
  );
};

const mapStateToProps = ({ theme, account }: IState) => {
  const { navCollapsed, navType, headerNavColor, mobileNav } = theme as ITheme;
  const { CompanyID, Company } = account as IAccount;
  return {
    navCollapsed,
    navType,
    headerNavColor,
    mobileNav,
    CompanyID,
    Company,
  };
};

export default connect(mapStateToProps, {
  toggleCollapsedNav,
  onMobileNavToggle,
})(HeaderNav);
