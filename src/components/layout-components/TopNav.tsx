import React, { useEffect } from "react";
import { connect } from "react-redux";
import { APP_NAME } from "../../configs/AppConfig";
import { NAV_TYPE_TOP } from "../../constants/ThemeConstant";
import { IState } from "../../redux/reducers";
import { ITheme } from "../../redux/reducers/Theme";
import utils from "../../utils";
import WithStringTranslate from "../../utils/translate";
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
    useEffect(() => {
        if (routeInfo) {
            const title = routeInfo.title;
            document.title = `${APP_NAME} - ${WithStringTranslate(title)}`;
        } else {
            document.title = APP_NAME;
        }
    }, [routeInfo]);
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
