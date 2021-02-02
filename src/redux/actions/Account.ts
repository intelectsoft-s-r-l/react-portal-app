import { CLEAR_INFO, UPDATE_SETTINGS } from "../constants/Account";
import { AppService } from "../../api/app";
import { ThunkAction } from "redux-thunk";
import { IState } from "../reducers";
import { CHANGE_LOCALE } from "../constants/Theme";
import { IUsers } from "../../api/types.response";
import { IAccount } from "../reducers/Account";
import TranslateText from "../../utils/translate";
import { DONE } from "../../constants/Messages";
import { message } from "antd";

type ThunkResult<R> = ThunkAction<R, IState, undefined, any>;

export const updateSettings = (payload: IUsers) => ({
  type: UPDATE_SETTINGS,
  payload,
});

export const clearSettings = () => ({
  type: CLEAR_INFO,
});

export const getProfileInfo = (): ThunkResult<void> => {
  return async (dispatch) => {
    return new AppService().GetProfileInfo().then((data) => {
      if (data && data.ErrorCode === 0) {
        const { User } = data;
        dispatch({ type: UPDATE_SETTINGS, payload: User });
        if (User.UiLanguage === 0) {
          dispatch({ type: CHANGE_LOCALE, locale: "ro" });
        } else if (User.UiLanguage === 1) {
          dispatch({ type: CHANGE_LOCALE, locale: "ru" });
        } else {
          dispatch({ type: CHANGE_LOCALE, locale: "en" });
        }
      }
    });
  };
};

export const setProfileInfo = (accountInfo: {
  User: IAccount;
}): ThunkResult<any> => {
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
