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
  HIDE_LOADING, VALIDATE_USER,
} from "../constants/Auth";
import axios from "axios";
import {} from "../../constants/ApiConstant";
import {message, Modal} from "antd";

export const signIn = (user) => ({
  type: SIGNIN,
  payload: user,
});

export const authenticated = (token, refreshToken) => ({
  type: AUTHENTICATED,
  token,
  refreshToken,
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
        dispatch(hideLoading());
        if (response.data["ErrorCode"] === 0) {
          dispatch(
            authenticated(response.data["Token"], response.data["RefreshToken"])
          );
        } else if (response.data["ErrorCode"] === 102) {
          dispatch(
            showAuthMessage("Incorrect username or password. Try again...")
          )
        }
      })
      .catch((e) => dispatch(hideLoading()));
  };
};

export const registerCompany = (companyData, history) => {
  return dispatch => {
    axios
      .post(`${API_IS_AUTH_SERVICE}/RegisterCompany`, companyData)
      .then(res => {
        dispatch(hideLoading());
        if (res.data["ErrorCode"] === 0) {
          message.loading("You'll be redirected in a few seconds...", 1.5);
          dispatch({ type: VALIDATE_USER, payload: res.data['Token']});
          setTimeout(() => {
            history.push('/auth/validate')
          }, 1500)
        } else{
          console.log(res.data)
          message.error("Something went wrong, try again!", 5);
        }
      })
      .catch(e => dispatch(hideLoading()))
  }
}

export const resetPassword = (email) => {
  return dispatch => {
    axios
      .post(`${API_IS_AUTH_SERVICE}/ResetPassword`, { Email: email })
      .then((response) => {
        if (response.data["ErrorCode"] === 0) {
          message.success("New password has been sent to your email!");
        } else if (response.data["ErrorCode"] === 106 ) {
          message.error("The email you've inserted probably does not exist!");
        }
      })
  }
}






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
