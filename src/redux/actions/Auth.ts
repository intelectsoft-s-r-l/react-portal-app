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
import axios from "axios";
import { message, Modal } from "antd";
import { IS_USER_ACTIVATED } from "../constants/Auth";
import { getProfileInfo } from "./Account";
import { onLocaleChange } from "./Theme";
import { EMAIL_CONFIRM_MSG, EXPIRE_TIME } from "../../constants/Messages";
import { API_AUTH_URL } from "../../configs/AppConfig";
import { AuthApi } from "../../api";
const publicIp = require("react-public-ip");

export const signIn = (user) => ({
    type: SIGNIN,
    payload: user,
});

export const authenticated = (token) => ({
    type: AUTHENTICATED,
    token,
});

export const signOut = () => ({
    type: SIGNOUT,
});

export const signOutSuccess = () => ({
    type: SIGNOUT_SUCCESS,
});

export const signUp = (user) => ({
    type: SIGNUP,
    payload: user,
});

export const signUpSuccess = (token) => ({
    type: SIGNUP_SUCCESS,
    token,
});

export const signInWithGoogle = () => ({
    type: SIGNIN_WITH_GOOGLE,
});

export const signInWithGoogleAuthenticated = (token) => ({
    type: SIGNIN_WITH_GOOGLE_AUTHENTICATED,
    token,
});

export const signInWithFacebook = () => ({
    type: SIGNIN_WITH_FACEBOOK,
});

export const signInWithFacebookAuthenticated = (token) => ({
    type: SIGNIN_WITH_FACEBOOK_AUTHENTICATED,
    token,
});

export const showAuthMessage = (message) => ({
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
export const isUserActivated = (boolean, Token) => ({
    type: IS_USER_ACTIVATED,
    userActivated: boolean,
    activationToken: Token,
});

export const refreshToken = () => async (dispatch) => {
    return new AuthApi().RefreshToken().then((data: any) => {
        const { ErrorCode, Token } = data;
        if (ErrorCode === 0) {
            dispatch(authenticated(Token));
            window.location.reload();
        } else if (ErrorCode === 105) {
            const key = "updatable";
            message
                .loading({ content: EXPIRE_TIME, key })
                .then(() => dispatch(signOut()));
        }
    });
};

const sendActivationCode = () => async (dispatch) => {
    return new AuthApi().SendActivationCode().then((data: any) => {
        const { ErrorMessage, ErrorCode } = data;
        if (ErrorCode === 0) message.success(EMAIL_CONFIRM_MSG);
        else dispatch(showAuthMessage(ErrorMessage));
    });
};

export const authorizeUser = (userData) => {
    return async (dispatch) => {
        return new AuthApi().Login(userData).then((data: any) => {
            const { ErrorCode, ErrorMessage, Token } = data;
            if (ErrorCode === 0) {
                dispatch(authenticated(Token));
                dispatch(getProfileInfo());
            } else if (ErrorCode === 102) {
                dispatch(showAuthMessage(ErrorMessage));
            } else if (ErrorCode === 108) {
                dispatch(hideLoading());
                Modal.confirm({
                    title: "Confirm registration",
                    content:
                        "Press the OK button down below if you want us to send you a new activation code!",
                    onOk: () => {
                        dispatch(sendActivationCode());
                    },
                });
            }
        });
    };
};
