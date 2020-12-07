import React, { useEffect } from "react";
import { Menu, Dropdown, Avatar, Modal } from "antd";
import { connect } from "react-redux";
import {
    // EditOutlined,
    SettingOutlined,
    // ShopOutlined,
    QuestionCircleOutlined,
    LogoutOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Icon from "../util-components/Icon";
import { signOut } from "../../redux/actions/Auth";
import { NavLink } from "react-router-dom";
import { IntlProvider } from "react-intl";
import IntlMessage from "../util-components/IntlMessage";
import AppLocale from "../../lang";
import { clearSettings } from "../../redux/actions/Account";
import Localization from "../../utils/Localization";
import { ITheme } from "../../redux/reducers/Theme";
import { IState } from "../../redux/reducers";
import { IAccount } from "../../redux/reducers/Account";
interface INavProfile {
    signOut?: () => void;
    FirstName?: string;
    Photo?: string;
    locale?: any;
}
const menuItem = [
    {
        title: <IntlMessage id={"header.profile.AccountSettings"} />,
        icon: SettingOutlined,
        path: "/app/account-settings",
    },
    {
        title: <IntlMessage id={"header.profile.HelpCenter"} />,
        icon: QuestionCircleOutlined,
        path: "/",
    },
];

const NavProfile = ({ signOut, FirstName, Photo, locale }: INavProfile) => {
    const currentAppLocale = AppLocale[locale];
    const { confirm } = Modal;
    const confirmLogout = () => {
        confirm({
            title: <Localization msg={"header.logout.message"} />,
            onOk: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(signOut!());
                    }, 1000);
                });
            },
        });
    };

    const profileMenu = (
        <div className="nav-profile nav-dropdown">
            <div className="nav-profile-header">
                <div className="d-flex">
                    <Avatar size={45} src={Photo} icon={<UserOutlined />} />
                    <div className="pl-3">
                        <h4 className="mb-0">{FirstName}</h4>
                    </div>
                </div>
            </div>
            <div className="nav-profile-body">
                <Menu selectable={false}>
                    {menuItem.map((el, i) => {
                        return (
                            <Menu.Item key={i}>
                                <NavLink to={el.path}>
                                    <Icon className="mr-3" type={el.icon} />
                                    <span className="font-weight-normal">
                                        {el.title}
                                    </span>
                                </NavLink>
                            </Menu.Item>
                        );
                    })}
                    <Menu.Item
                        key={menuItem.length + 1}
                        onClick={confirmLogout}
                    >
                        <span>
                            <LogoutOutlined className="mr-3" />
                            <span className="font-weight-normal">
                                <IntlMessage id={"header.profile.SignOut"} />
                            </span>
                        </span>
                    </Menu.Item>
                </Menu>
            </div>
        </div>
    );
    return (
        <Dropdown
            placement="bottomRight"
            overlay={profileMenu}
            trigger={["click"]}
        >
            <Menu className="d-flex align-item-center" mode="horizontal">
                <Menu.Item>
                    <Avatar src={Photo} icon={<UserOutlined />} />
                </Menu.Item>
            </Menu>
        </Dropdown>
    );
};

const mapStateToProps = ({ account, theme }: IState) => {
    const { FirstName, Photo } = account as IAccount;
    const { locale } = theme as ITheme;
    return { FirstName, Photo, locale };
};

export default connect(mapStateToProps, { signOut })(NavProfile);
