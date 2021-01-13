import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import {
  APP_PREFIX_PATH,
  AUTH_PREFIX_PATH,
  SUBDIR_PATH,
} from "../../../../configs/AppConfig";
import { getProfileInfo } from "../../../../redux/actions/Account";
import { authenticated } from "../../../../redux/actions/Auth";
import { onHeaderNavColorChange } from "../../../../redux/actions/Theme";
import { IState } from "../../../../redux/reducers";

const Admin = ({ match, history }: RouteComponentProps) => {
  const dispatch = useDispatch();
  const Token = useSelector((state: IState) => state["auth"]!.token);

  useEffect(() => {
    if ("Token" in match.params) {
      dispatch(authenticated(match.params["Token"]));
      dispatch(getProfileInfo());
      if (SUBDIR_PATH === "/testclientportal")
        dispatch(onHeaderNavColorChange("#DE4436"));
      if (Token) {
        history.push(APP_PREFIX_PATH);
      }
      history.push(AUTH_PREFIX_PATH);
    }
  }, []);
  return <div>Loading...</div>;
};
export default Admin;
