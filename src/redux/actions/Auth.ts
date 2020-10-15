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
import { message } from "antd";

export const signIn = (user) => ({
  type: SIGNIN,
  payload: user,
});

export const authenticated = (token) => ({
  type: AUTHENTICATED,
  token
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

export const authorizeUser = (userData) => {
  return (dispatch) => {
    axios
      .post(`${API_IS_AUTH_SERVICE}/AuthorizeUser`, userData)
      .then((response) => {
        console.log(response.data);
        const { ErrorCode, ErrorMessage, Token } = response.data;
        dispatch(hideLoading());
        if (ErrorCode === 0) {
          dispatch(authenticated(Token));
        } else if (ErrorCode === 102) {
          dispatch(showAuthMessage(ErrorMessage));
        } else if (ErrorCode === 108) {
          /* Tell user that his account is not activated, and ask him to go to his email in order to confirm the registration. */
          dispatch(showAuthMessage(ErrorMessage));
          // message.loading("You'll be redirected in a few seconds...", 1.5);
          // setTimeout(() => {
          //   history.push("/auth/error");
          // }, 1500);
        }
      })
      .catch((e) => dispatch(hideLoading()));
  };
};

export const registerCompany = (companyData: {[key: string]: any}, history) => {
  return (dispatch) => {
    axios
      .post(`${API_IS_AUTH_SERVICE}/RegisterCompany`, companyData)
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
      .catch((e) => dispatch(hideLoading()));
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
