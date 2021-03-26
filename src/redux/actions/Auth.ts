import {
  AUTHENTICATED,
  SIGNOUT,
  SHOW_AUTH_MESSAGE,
  HIDE_AUTH_MESSAGE,
  SHOW_LOADING,
  HIDE_LOADING,
} from "../constants/Auth";
import { message, Modal } from "antd";
import { getProfileInfo } from "./Account";
import { ACTIVATE_ACCOUNT, EMAIL_CONFIRM_MSG } from "../../constants/Messages";
import { AuthService } from "../../api/auth";
import { ThunkAction } from "redux-thunk";
import { IState } from "../reducers";
import TranslateText from "../../utils/translate";
import axios from "axios";
import {
  API_AUTH_URL,
  APP_PREFIX_PATH,
  SUBDIR_PATH,
} from "../../configs/AppConfig";
import { onHeaderNavColorChange } from "./Theme";
import history from "../../history";

type ThunkResult<R> = ThunkAction<R, IState, undefined, any>;

export const authenticated = (token: string) => ({
  type: AUTHENTICATED,
  token,
});

export const signOut = () => ({
  type: SIGNOUT,
});

export const showAuthMessage = (message: string) => ({
  type: SHOW_AUTH_MESSAGE,
  message,
});

export const hideAuthMessage = () => ({
  type: HIDE_AUTH_MESSAGE,
});

export const showLoading = () => ({
  type: SHOW_LOADING,
});
export const hideLoading = () => ({
  type: HIDE_LOADING,
});

const handleAccountActivation = (Token: string) => {
  Modal.confirm({
    content: TranslateText(ACTIVATE_ACCOUNT),
    onOk: async () => {
      // No idea why I'm calling axios here and not an isntance of axios (:
      return await axios
        .get(`${API_AUTH_URL}/SendActivationCode`, {
          params: {
            Token,
          },
        })
        .then((response) => {
          if (response.data.ErrorCode === 0) {
            message.success({
              content: TranslateText(EMAIL_CONFIRM_MSG),
              key: "updatable",
              duration: 2,
            });
          }
        });
    },
  });
};

export const authorizeUser = (
  email: string,
  password: string
): ThunkResult<void> => {
  return async (dispatch) => {
    return new AuthService()
      .Login(email, password)
      .then((data) => {
        if (data) {
          const { ErrorCode, ErrorMessage, Token } = data;
          if (ErrorCode === 0) {
            dispatch(authenticated(Token));
            dispatch(getProfileInfo());
            if (SUBDIR_PATH === "/testclientportal") {
              dispatch(onHeaderNavColorChange("#DE4436"));
            }
            return data;
          } else if (ErrorCode === 102) {
            dispatch(showAuthMessage(ErrorMessage!.toString()));
            return data;
          } else if (ErrorCode === 108) {
            handleAccountActivation(Token);
            return data;
          } else {
            dispatch(hideLoading());
            dispatch(showAuthMessage(ErrorMessage!.toString()));
            return data;
          }
        }
      })
      .then((data) => {
        dispatch(hideLoading());
        return data;
      });
  };
};
