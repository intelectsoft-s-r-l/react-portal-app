import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import {
  APP_PREFIX_PATH,
  AUTH_PREFIX_PATH,
  DOMAIN,
  SUBDIR_PATH,
} from "../../../../configs/AppConfig";
import { getProfileInfo } from "../../../../redux/actions/Account";
import { authenticated } from "../../../../redux/actions/Auth";
import { onHeaderNavColorChange } from "../../../../redux/actions/Theme";
import { IState } from "../../../../redux/reducers";
import Cookies from "js-cookie";
import { TOKEN_EXPIRE_DAYS } from "../../../../constants/ApiConstant";

const Admin = ({ match, history }: RouteComponentProps) => {
  const dispatch = useDispatch();
  const Token = Cookies.get("Token");

  useEffect(() => {
    console.log(match.params);
    if ("Token" in match.params) {
      dispatch(authenticated(match.params["Token"]));
      Cookies.set("Token", match.params["Token"], {
        expires: TOKEN_EXPIRE_DAYS,
        domain: DOMAIN,
        path: "/",
      });
      if (SUBDIR_PATH === "/testclientportal")
        dispatch(onHeaderNavColorChange("#DE4436"));

      history.push(APP_PREFIX_PATH);
    }
  }, []);
  return <div>Loading...</div>;
};
export default Admin;
