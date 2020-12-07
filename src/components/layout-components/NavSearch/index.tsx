import React from "react";
import { connect } from "react-redux";
import { CloseOutlined } from "@ant-design/icons";
import Utils from "../../../utils";
import SearchInput from "./SearchInput";
import { IState } from "../../../redux/reducers";
import { ITheme } from "../../../redux/reducers/Theme";

interface INavSearch {
    active?: any;
    close?: any;
    headerNavColor?: string;
}

export const NavSearch = (props: INavSearch) => {
    const { active, close, headerNavColor } = props;
    const mode = Utils.getColorContrast(headerNavColor);

    return (
        <div
            className={`nav-search ${
                active ? "nav-search-active" : ""
            } ${mode}`}
            style={{ backgroundColor: headerNavColor }}
        >
            <div className="d-flex align-items-center w-100">
                <SearchInput close={close} active={active} />
            </div>
            <div className="nav-close" onClick={close}>
                <CloseOutlined />
            </div>
        </div>
    );
};

const mapStateToProps = ({ theme }: IState) => {
    const { headerNavColor } = theme as ITheme;
    return { headerNavColor };
};

export default connect(mapStateToProps, {})(NavSearch);
