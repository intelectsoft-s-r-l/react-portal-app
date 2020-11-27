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
const menuItem = [
    // {
    // 	title: "Edit Profile",
    // 	icon: EditOutlined ,
    // 	path: "/app/account-settings"
    //   },

    {
        title: <IntlMessage id={"header.profile.AccountSettings"} />,
        icon: SettingOutlined,
        path: "/app/account-settings",
    },
    //   {
    // 	title: "Billing",
    // 	icon: ShopOutlined ,
    // 	path: "/app/account-settings/billing"
    // },
    {
        title: <IntlMessage id={"header.profile.HelpCenter"} />,
        icon: QuestionCircleOutlined,
        path: "/",
    },
];

const NavProfile = ({
    signOut,
    token,
    history,
    FirstName,
    Photo,
    locale,
    isAuth,
    clearSettings,
}) => {
    const currentAppLocale = AppLocale[locale];
    const { confirm } = Modal;
    const confirmLogout = () => {
        confirm({
            title: (
                <IntlProvider
                    locale={currentAppLocale.locale}
                    messages={currentAppLocale.messages}
                >
                    <IntlMessage id={"header.logout.message"} />
                </IntlProvider>
            ),
            onOk: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(signOut());
                        // resolve(clearSettings());
                    }, 1000);
                }).catch(() => console.log("Oops errors!"));
            },
            onCancel: () => {},
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

const mapStateToProps = ({ auth, account, theme }) => {
    const { token, isAuth } = auth;
    const { locale } = theme;
    const { FirstName, Photo } = account;
    return { token, FirstName, Photo, locale, isAuth };
};

export default connect(mapStateToProps, { signOut, clearSettings })(NavProfile);
