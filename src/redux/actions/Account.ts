import { CLEAR_INFO, UPDATE_SETTINGS } from "../constants/Account";
import { AppService } from "../../api/app";
import { ThunkAction } from "redux-thunk";
import { IState } from "../reducers";
import { CHANGE_LOCALE } from "../constants/Theme";
import { IUsers } from "../../api/app/types";
import { IAccount } from "../reducers/Account";
import TranslateText from "../../utils/translate";
import { DONE } from "../../constants/Messages";
import { message } from "antd";
import { EnErrorCode } from "../../api/";
import { AuthService } from "../../api/auth";
import { onHeaderNavColorChange } from "./Theme";

type ThunkResult<R> = ThunkAction<R, IState, undefined, any>;

enum EnLang {
  RO = 0,
  RU = 1,
  EN = 1,
}
export enum EnCompany {
  INTELECTSOFT = 1,
}

export const updateSettings = (payload: IUsers) => ({
  type: UPDATE_SETTINGS,
  payload,
});

export const clearSettings = () => ({
  type: CLEAR_INFO,
});

export const getProfileInfo = (): ThunkResult<void> => {
  return async (dispatch) => {
    return new AuthService().GetProfileInfo().then(async (data) => {
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        const { User } = data;
        if (window.location.origin.includes("test"))
          dispatch(onHeaderNavColorChange("#DE4436"));
        //let Company: string = "";
        //// Call GetCompanyInfo only if the user is an Admin,
        //// in order to show who are you managing at the moment
        //if (User.CompanyID === EnCompany.INTELECTSOFT) {
        //Company =
        //(await new AppService()
        //.GetCompanyInfo()
        //.then((data) => data.Company.CommercialName)) ?? "";
        //}
        dispatch({ type: UPDATE_SETTINGS, payload: User });
        switch (User.UiLanguage) {
          case EnLang.RO:
            dispatch({ type: CHANGE_LOCALE, locale: "ro" });
            break;
          case EnLang.RU:
            dispatch({ type: CHANGE_LOCALE, locale: "ru" });
            break;
          default:
            dispatch({ type: CHANGE_LOCALE, locale: "en" });
        }
      }
    });
  };
};

export const setProfileInfo = (accountInfo: {
  User: IAccount;
}): ThunkResult<void> => {
  return async (dispatch) => {
    return new AppService().UpdateUser(accountInfo).then((data) => {
      if (data && data.ErrorCode === 0) {
        dispatch(getProfileInfo());
        message.success({
          content: TranslateText(DONE),
          key: "updatable",
          duration: 1,
        });
      }
    });
  };
};
