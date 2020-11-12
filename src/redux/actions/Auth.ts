import { API_IS_AUTH_SERVICE } from "../../constants/ApiConstant";
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
import { EXPIRE_TIME } from "../../constants/Messages";
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

export const refreshToken = (Token) => async (dispatch) => {
    axios
        .get(`${API_IS_AUTH_SERVICE}/RefreshToken`, {
            params: { Token },
        })
        .then((res) => {
            if (res.data.ErrorCode === 0) {
                dispatch({ type: SET_TOKEN, token: res.data.Token });
            } else if (res.data.ErrorCode === 105) {
                message
                    .loading(EXPIRE_TIME, 1.5)
                    .then(() => dispatch(signOut()));
            }
        });
};

export const sendActivationCode = (Token) => {
    return async (dispatch) => {
        Modal.confirm({
            title: "Confirm registration",
            content: `Your account is not activated. Press the OK button down below if you
      want us to sent you a new confirmation message`,
            onOk() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(
                            axios
                                .get(
                                    `${API_IS_AUTH_SERVICE}/SendActivationCode`,
                                    {
                                        params: {
                                            Token,
                                        },
                                    }
                                )
                                .then((res) => {
                                    console.log(res.data);
                                    if (res.data.ErrorCode === 0) {
                                        message.success(
                                            "New email message was sent!"
                                        );
                                    } else {
                                        dispatch(
                                            showAuthMessage(
                                                res.data.ErrorMessage
                                            )
                                        );
                                    }
                                })
                        );
                    }, 2000);
                });
            },
            onCancel() {},
        });
    };
};

export const authorizeUser = (userData) => {
    return async (dispatch, getState) => {
        axios
            .post(`${API_IS_AUTH_SERVICE}/AuthorizeUser`, {
                ...userData,
                info: (await publicIp.v4()) || "",
            })
            .then((response) => {
                dispatch(hideLoading());
                console.log(response.data);
                const { ErrorCode, ErrorMessage, Token } = response.data;
                if (ErrorCode === 0) {
                    dispatch(authenticated(Token));
                    dispatch(getProfileInfo(Token));
                } else if (ErrorCode === 102) {
                    dispatch(showAuthMessage(ErrorMessage));
                } else if (ErrorCode === 108) {
                    dispatch(sendActivationCode(Token));
                    /* Tell user that his account is not activated, and ask him if he wants a new email code. If yes - send the code, if not, cancel. */
                }
            })
            .catch((e) => dispatch(hideLoading()));
    };
};

// /* Example of API Call inside action with redux-thunk */
// function fetchApi() {
//   return async (dispatch) => {
//     dispatch(showLoading());
//     try {
//       const response = await fetch(`url`);
//       const data = response.json();
//       // Simulate API Call delay time
//       setTimeout(() => {
//         dispatch({ type: "FETCH_POSTS", payload: data });
//         dispatch(hideLoading());
//       }, 1000);
//     } catch {
//       dispatch(hideLoading());
//       dispatch(showAuthMessage("SOMETHING WENT WRONG"));
//     }
//   };
// }

// /* Example of API Call inside action with redux-thunk and axios.post */
// function addPost(message) {
//   return (dispatch) => {
//     dispatch(showLoading());
//     axios.post("url", message).then(() => {
//       // dispatch(addPost(message));
//       dispatch(hideLoading());
//     });
//   };
// }
