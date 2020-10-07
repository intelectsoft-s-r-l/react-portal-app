import {
  AUTHENTICATED,
  SHOW_AUTH_MESSAGE,
  HIDE_AUTH_MESSAGE,
  SIGNOUT_SUCCESS,
  SIGNUP_SUCCESS,
  SHOW_LOADING,
  SIGNOUT,
  SIGNUP,
  SIGNIN_WITH_GOOGLE_AUTHENTICATED,
  SIGNIN_WITH_FACEBOOK_AUTHENTICATED,
  HIDE_LOADING, VALIDATE_USER,
} from "../constants/Auth";

const initState = {
  loading: false,
  message: "",
  showMessage: false,
  redirect: "",
  token: "",
  refreshToken: "",
  isAuth: false,
  RegistrationToken: ""
};

const auth = (state = initState, action) => {
  switch (action.type) {
    case AUTHENTICATED:
      return {
        ...state,
        loading: false,
        redirect: "/",
        token: action.token,
        isAuth: true,
        refreshToken: action.refreshToken,
      };

    case SHOW_AUTH_MESSAGE:
      return {
        ...state,
        message: action.message,
        showMessage: true,
        loading: false,
      };
    case HIDE_AUTH_MESSAGE:
      return {
        ...state,
        message: "",
        showMessage: false,
      };
    case SIGNOUT:
      return {
        ...state,
        token: null,
        redirect: "/auth/login",
        loading: false,
        isAuth: false,
        refreshToken: null,
      };

    case SIGNOUT_SUCCESS: {
      return {
        ...state,
        token: null,
        redirect: "/auth/login",
        loading: false,
      };
    }
    case SIGNUP_SUCCESS: {
      return {
        ...state,
        loading: false,
        token: action.token,
      };
    }
    case SHOW_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case HIDE_LOADING:
      return {
        ...state,
        loading: false,
      };
    case SIGNIN_WITH_GOOGLE_AUTHENTICATED: {
      return {
        ...state,
        loading: false,
        token: action.token,
      };
    }
    case SIGNIN_WITH_FACEBOOK_AUTHENTICATED: {
      return {
        ...state,
        loading: false,
        token: action.token,
      };
    }
    case VALIDATE_USER:
      return {
        ...state,
        RegistrationToken: action.payload
      }

    default:
      return state;
  }
};

export default auth;
