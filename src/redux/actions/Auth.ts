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
import { AuthService } from "../../api";
import { ThunkAction } from "redux-thunk";
import { IState } from "../reducers";
import WithStringTranslate from "../../utils/translate";
import axios from "axios";
import { API_AUTH_URL } from "../../configs/AppConfig";
import { IAuthorizeUserRequest } from "../../api/types.request";

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

export const sendActivationCode = (): ThunkResult<void> => async (dispatch) => {
  return new AuthService().SendActivationCode().then((data) => {
    const { ErrorMessage, ErrorCode } = data;
    if (data) {
      if (ErrorCode === 0)
        message.success({
          content: WithStringTranslate(EMAIL_CONFIRM_MSG),
          key: "updatable",
          duration: 2,
        });
      else dispatch(showAuthMessage(ErrorMessage ?? ""));
    }
  });
};

export const authorizeUser = (
  userData: IAuthorizeUserRequest
): ThunkResult<void> => {
  return async (dispatch) => {
    return new AuthService()
      .Login(userData)
      .then((data) => {
        if (data) {
          const { ErrorCode, ErrorMessage, Token } = data;
          if (ErrorCode === 0) {
            dispatch(authenticated(Token));
            dispatch(getProfileInfo());
          } else if (ErrorCode === 102) {
            dispatch(showAuthMessage(ErrorMessage!.toString()));
          } else if (ErrorCode === 108) {
            Modal.confirm({
              content: WithStringTranslate(ACTIVATE_ACCOUNT),
              onOk: async () => {
                return await axios
                  .get(`${API_AUTH_URL}/SendActivationCode`, {
                    params: {
                      Token,
                    },
                  })
                  .then((response: any) => {
                    if (response.data.ErrorCode === 0) {
                      message.success({
                        content: WithStringTranslate(EMAIL_CONFIRM_MSG),
                        key: "updatable",
                        duration: 2,
                      });
                    } else {
                      dispatch(showAuthMessage("Error: Internal Error"));
                    }
                  });
              },
            });
          } else {
            dispatch(hideLoading());
            dispatch(showAuthMessage(ErrorMessage!.toString()));
          }
        }
      })
      .then(() => dispatch(hideLoading()));
  };
};
