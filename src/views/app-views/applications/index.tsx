import React, { lazy, useEffect, useLayoutEffect, useState } from "react";
// import AppList from "./AppList";
import axios from "axios";
// import { API_IS_APP_SERVICE } from "../../../constants/ApiConstant";
import { connect, useDispatch, useSelector } from "react-redux";
import Utils from "../../../utils";
import { signOut } from "../../../redux/actions/Auth";
// import { getMarketApps } from "../../../redux/actions/Applications";
import { Route } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
import Loading from "../../../components/shared-components/Loading";
import { API_IS_CLIENT_SERVICE } from "../../../constants/ApiConstant";
import Axios from "axios";
import { message } from "antd";
import Market from "./Market";
export interface IPackages {
    ID: number;
    MaxValue: number;
    MinValue: number;
    Name: string;
    Price: number;
    Status: number;
    ValidFrom: string;
    ValidTo: string;
}
export interface IMarketAppList {
    AppType: number;
    ApyKey: string;
    MarketID: number;
    ApplicationID: number;
    LicenseActivationCode: number;
    LicenseActivationCodeValidHours: number;
    LicenseActivationCodeValidTo: string;
    LongDescription: string;
    Name: string;
    Packages: IPackages[];
    Photo: string;
    ShortDescription: string;
    Status: number;
}
export interface IApplications {
    ErrorCode: number;
    ErrorMessage: string;
    MarketAppList: IMarketAppList[];
}
const Applications = ({ signOut, Token, loading }) => {
    return <>{loading ? <Loading /> : <Market />}</>;
};
const mapStateToProps = ({ auth }) => {
    const { token: Token, loading } = auth;
    return { Token, loading };
};
export default connect(mapStateToProps, { signOut })(Applications);
