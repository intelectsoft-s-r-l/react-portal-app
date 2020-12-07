import React from "react";
import { connect } from "react-redux";
import { NAV_TYPE_TOP } from "../../constants/ThemeConstant";
import { IState } from "../../redux/reducers";
import { ITheme } from "../../redux/reducers/Theme";
import utils from "../../utils";
import MenuContent from "./MenuContent";

interface TopNavProps {
    topNavColor?: any;
    localization?: boolean;
    routeInfo?: any;
}

export const TopNav = ({
    topNavColor,
    localization = true,
    routeInfo,
}: TopNavProps) => {
    const props = { topNavColor, localization };
    return (
        <div
            className={`top-nav ${utils.getColorContrast(topNavColor)}`}
            style={{ backgroundColor: topNavColor }}
        >
            <div className="top-nav-wrapper">
                <MenuContent type={NAV_TYPE_TOP} {...props} />
            </div>
        </div>
    );
};

const mapStateToProps = ({ theme }: IState) => {
    const { topNavColor } = theme as ITheme;
    return { topNavColor };
};

export default connect(mapStateToProps)(TopNav);
