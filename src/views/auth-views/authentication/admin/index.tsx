import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    APP_PREFIX_PATH,
    AUTH_PREFIX_PATH,
} from "../../../../configs/AppConfig";
import { getProfileInfo } from "../../../../redux/actions/Account";
import { authenticated } from "../../../../redux/actions/Auth";

const Admin = ({ match, history }) => {
    const dispatch = useDispatch();
    const Token = useSelector((state) => state["auth"].token);
    const redirect = useSelector((state) => state["auth"].redirect);

    useEffect(() => {
        dispatch(getProfileInfo(match.params.Token));
        dispatch(authenticated(match.params.Token));
        if (Token) {
            history.push(APP_PREFIX_PATH);
        }
        history.push(AUTH_PREFIX_PATH);
    }, []);
    return <div>Loading...</div>;
};
export default Admin;
