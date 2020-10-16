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
} from "../constants/Auth";
import axios from "axios";
import { message, Modal } from "antd";
import { IS_USER_ACTIVATED } from "../constants/Auth";
import { getProfileInfo } from "./Account";
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
                .get(`${API_IS_AUTH_SERVICE}/SendActivationCode`, {
                  params: {
                    Token,
                  },
                })
                .then((res) => {
                  console.log(res.data);
                  if (res.data.ErrorCode === 0) {
                    message.success("New email message was sent!");
                  } else {
                    dispatch(showAuthMessage(res.data.ErrorMessage));
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
  return async (dispatch) => {
    dispatch(hideLoading());
    axios
      .post(`${API_IS_AUTH_SERVICE}/AuthorizeUser`, {
        ...userData,
        info: (await publicIp.v4()) || "",
      })
      .then((response) => {
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

export const resetPassword = async (email) => {
  axios
    .post(`${API_IS_AUTH_SERVICE}/ResetPassword`, {
      Email: email,
      info: (await publicIp.v4()) || "",
    })
    .then((response) => {
      console.log(response.data);
      if (response.data["ErrorCode"] === 0) {
        /* Use response.data['ErrorMessage'] when the API will be able to handle error messages correctly  */
        message.success("New password has been sent to your email!");
      } else {
        message.error(response.data["ErrorMessage"]);
      }
    });
};

export const registerCompany = (
  companyData: { [key: string]: any },
  history
) => {
  return async (dispatch) => {
    axios
      .post(`${API_IS_AUTH_SERVICE}/RegisterCompany`, {
        ...companyData,
      })
      .then((res) => {
        const { ErrorCode, ErrorMessage } = res.data;
        dispatch(hideLoading());
        console.log(res.data);
        if (ErrorCode === 108) {
          /*  Inform user to go to his/her email  */
          message.success(
            "Please confirm the registration by clicking on the link we've sent to your email!",
            10
          );
        } else {
          message.error(ErrorMessage, 5);
        }
      })
      .catch(() => dispatch(hideLoading()));
  };
};

// const registerUser = (userData) => {
//   return (dispatch) => {
//     dispatch(showLoading());
//     axios.post(API_REGISTER_USER, userData);
//   };
// };

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
