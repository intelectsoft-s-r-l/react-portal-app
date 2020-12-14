import {
    SIGNIN,
    AUTHENTICATED,
    SIGNOUT,
    SIGNOUT_SUCCESS,
    SHOW_AUTH_MESSAGE,
    HIDE_AUTH_MESSAGE,
    SIGNUP,
    SIGNUP_SUCCESS,
    SHOW_LOADING,
    SIGNIN_WITH_GOOGLE,
    SIGNIN_WITH_GOOGLE_AUTHENTICATED,
    SIGNIN_WITH_FACEBOOK,
    SIGNIN_WITH_FACEBOOK_AUTHENTICATED,
    HIDE_LOADING,
    VALIDATE_USER,
    SET_TOKEN,
} from "../constants/Auth";
import { message, Modal } from "antd";
import { getProfileInfo } from "./Account";
import { ACTIVATE_ACCOUNT, EMAIL_CONFIRM_MSG } from "../../constants/Messages";
import { AuthApi } from "../../api";
import { ThunkAction } from "redux-thunk";
import { IState } from "../reducers";
import { IAuthorizerUser } from "../../api/auth_types";
import WithStringTranslate from "../../utils/translate";
import axios from "axios";
import { API_AUTH_URL } from "../../configs/AppConfig";
enum SendType {
    list = 0,
    auth = 1,
}
type ThunkResult<R> = ThunkAction<R, IState, undefined, any>;

export const authenticated = (token: string) => ({
    type: AUTHENTICATED,
    token,
});

export const signOut = () => ({
    type: SIGNOUT,
});

export const showAuthMessage = (message: string | JSX.Element) => ({
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
    return new AuthApi().SendActivationCode().then((data: any) => {
        const { ErrorMessage, ErrorCode } = data;
        if (data) {
            if (ErrorCode === 0)
                message.success({
                    content: WithStringTranslate(EMAIL_CONFIRM_MSG),
                    key: "updatable",
                    duration: 2,
                });
            else dispatch(showAuthMessage(ErrorMessage));
        }
    });
};

export const authorizeUser = (userData: IAuthorizerUser): ThunkResult<void> => {
    return async (dispatch) => {
        return new AuthApi()
            .Login(userData)
            .then((data: any) => {
                if (data) {
                    const { ErrorCode, ErrorMessage, Token } = data;
                    if (ErrorCode === 0) {
                        dispatch(authenticated(Token));
                        dispatch(getProfileInfo());
                    } else if (ErrorCode === 102) {
                        dispatch(showAuthMessage(ErrorMessage));
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
                                                content: WithStringTranslate(
                                                    EMAIL_CONFIRM_MSG
                                                ),
                                                key: "updatable",
                                                duration: 2,
                                            });
                                        } else {
                                            dispatch(
                                                showAuthMessage(
                                                    "Error: Internal Error"
                                                )
                                            );
                                        }
                                    });
                            },
                        });
                    } else {
                        dispatch(hideLoading());
                        dispatch(showAuthMessage(ErrorMessage));
                    }
                }
            })
            .then(() => dispatch(hideLoading()));
    };
};
