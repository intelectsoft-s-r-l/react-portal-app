import React, {ReactNode, ReactText} from "react";
import { connect } from "react-redux";
import { Radio, Switch, Button, message, Grid } from 'antd';
import {
  toggleCollapsedNav,
  onNavTypeChange,
  onNavStyleChange,
  onTopNavColorChange,
  onHeaderNavColorChange,
} from "../../redux/actions/Theme";
import { CopyOutlined } from "@ant-design/icons";
import CopyToClipboard from "react-copy-to-clipboard";
import NavLanguage from "./NavLanguage";
import {
  SIDE_NAV_LIGHT,
  NAV_TYPE_SIDE,
  NAV_TYPE_TOP,
  SIDE_NAV_DARK,
} from "../../constants/ThemeConstant";
import AppLocale from "../../lang";
import IntlMessage from "../util-components/IntlMessage";
import Utils from '../../utils/index';

export interface IListOption {
  name?: string | ReactNode;
  selector?: any;
  disabled?: boolean;
  vertical?: boolean;
}

const colorOptions = ["#3e82f7", "#24a772", "#de4436", "#924aca", "#193550"];

const white = "#ffffff";

const ListOption = ({ name, selector, disabled, vertical }: IListOption) => (
  <div
    className={`my-4 ${
      vertical ? "" : "d-flex align-items-center justify-content-between"
    }`}
  >
    <div
      className={`${disabled ? "opacity-0-3" : ""} ${vertical ? "mb-3" : ""}`}
    >
      {name}
    </div>
    <div>{selector}</div>
  </div>
);

const ThemeConfigurator = ({
  navType,
  sideNavTheme,
  navCollapsed,
  topNavColor,
  headerNavColor,
  locale,
  toggleCollapsedNav,
  onNavTypeChange,
  onNavStyleChange,
  onTopNavColorChange,
  onHeaderNavColorChange,
}) => {
  const { useBreakpoint } = Grid;
  const screens = Utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes("lg");
  const isNavTop = navType === NAV_TYPE_TOP;
  const AppCurrentLocale = AppLocale[locale];
  const isCollapse = navCollapsed;
  const ontopNavColorClick = (value) => {
    if (value === white) {
      onHeaderNavColorChange("#193550");
      onTopNavColorChange(white);
    } else {
      onTopNavColorChange(value);
      onHeaderNavColorChange(white);
    }
  };
  const onHeaderNavColorClick = (value) => {
    if (value === white) {
      onTopNavColorChange(colorOptions[0]);
    }
    onHeaderNavColorChange(value);
  };

  const onNavTypeClick = (value) => {
    if (value === NAV_TYPE_TOP) {
      onTopNavColorChange(colorOptions[0]);
      onHeaderNavColorChange(white);
      toggleCollapsedNav(false);
    }
    if (value === NAV_TYPE_TOP) {
      onHeaderNavColorChange(white);
    }
    onNavTypeChange(value);
  };

  const genCopySettingJson = (configState) =>
    JSON.stringify(configState, null, 2);
  return (
    <>
      <div className="mb-5">
        <h4 className="mb-3 font-weight-bold"><IntlMessage id={"theme.Navigation"}/></h4>
        {isNavTop ? (
          <ListOption
            name={<IntlMessage id={"theme.TopNavColor"}/>}
            vertical
            selector={
              <Radio.Group
                className="color-selector"
                onChange={(e) => ontopNavColorClick(e.target.value)}
                value={topNavColor}
              >
                {colorOptions.map((color) => (
                  <Radio
                    key={color}
                    style={{ backgroundColor: color }}
                    value={color}
                  />
                ))}
                <Radio
                  className="bg-white"
                  key={white}
                  style={{ backgroundColor: white }}
                  value={white}
                />
              </Radio.Group>
            }
          />
        ) : (
          <ListOption
            name={<IntlMessage id={"theme.HeaderNavColor"}/>}
            vertical
            selector={
              <Radio.Group
                className="color-selector"
                onChange={(e) => onHeaderNavColorClick(e.target.value)}
                value={headerNavColor}
              >
                {colorOptions.map((color) => (
                  <Radio
                    key={color}
                    style={{ backgroundColor: color }}
                    value={color}
                  />
                ))}
                <Radio
                  className="bg-white"
                  key={white}
                  style={{ backgroundColor: white }}
                  value={white}
                />
              </Radio.Group>
            }
          />
        )}

        {isMobile || (
          <>
          <ListOption
          name={<IntlMessage id={"theme.NavigationType"}/>}
          selector={
            <Radio.Group
              size="small"
              onChange={(e) => onNavTypeClick(e.target.value)}
              value={navType}
            >
              <Radio.Button value={NAV_TYPE_SIDE}>{<IntlMessage id={"theme.Side"}/>}</Radio.Button>
              <Radio.Button value={NAV_TYPE_TOP}>{<IntlMessage id={"theme.Top"}/>}</Radio.Button>
            </Radio.Group>
          }
        />
        <ListOption
          name={<IntlMessage id={"theme.SideNavColor"}/>}
          selector={
            <Radio.Group
              disabled={isNavTop}
              size="small"
              onChange={(e) => onNavStyleChange(e.target.value)}
              value={sideNavTheme}
            >
              <Radio.Button value={SIDE_NAV_LIGHT}>{<IntlMessage id={"theme.Light"}/>}</Radio.Button>
              <Radio.Button value={SIDE_NAV_DARK}>{<IntlMessage id={"theme.Dark"}/>}</Radio.Button>
            </Radio.Group>
          }
          disabled={isNavTop}
        />
        <ListOption
          name={<IntlMessage id={"theme.SideNavCollapse"}/>}
          selector={
            <Switch
              disabled={isNavTop}
              checked={isCollapse}
              onChange={() => toggleCollapsedNav(!navCollapsed)}
            />
          }
          disabled={isNavTop}
        />
        </>
        )}
        
      </div>
      <div className="mb-5">
        <h4 className="mb-3 font-weight-bold">{<IntlMessage id={"theme.Locale"}/>}</h4>
        <ListOption name={<IntlMessage id={"theme.Language"}/>} selector={<NavLanguage configDisplay triggerType={"click"} />} />
      </div>
			{/* Copy to clipboard Theme Config */}
      {/*<div>*/}
      {/*  <CopyToClipboard*/}
      {/*    text={genCopySettingJson({*/}
      {/*      navType,*/}
      {/*      sideNavTheme,*/}
      {/*      navCollapsed,*/}
      {/*      topNavColor,*/}
      {/*      headerNavColor,*/}
      {/*      locale,*/}
      {/*    })}*/}
      {/*    onCopy={() =>*/}
      {/*      message.success(*/}
      {/*        "Copy Success, please paste it to src/configs/AppConfig.js THEME_CONFIG variable."*/}
      {/*      )*/}
      {/*    }*/}
      {/*  >*/}
      {/*    <Button icon={<CopyOutlined />} block>*/}
      {/*      <span>Copy Setting</span>*/}
      {/*    </Button>*/}
      {/*  </CopyToClipboard>*/}
      {/*</div>*/}
    </>
  );
};

const mapStateToProps = ({ theme }) => {
  const {
    navType,
    sideNavTheme,
    navCollapsed,
    topNavColor,
    headerNavColor,
    locale,
  } = theme;
  return {
    navType,
    sideNavTheme,
    navCollapsed,
    topNavColor,
    headerNavColor,
    locale,
  } ;
};

const mapDispatchToProps = {
  toggleCollapsedNav,
  onNavTypeChange,
  onNavStyleChange,
  onTopNavColorChange,
  onHeaderNavColorChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeConfigurator);
