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
  HIDE_LOADING,
  VALIDATE_USER,
  IS_USER_ACTIVATED,
  SET_TOKEN,
  REDIRECT,
  SET_IS_REFRESHING,
} from "../constants/Auth";
import Cookies from "js-cookie";
import { AUTH_PREFIX_PATH, DOMAIN } from "../../configs/AppConfig";
import { useHistory } from "react-router-dom";
import Utils from "../../utils";
import HttpService from "../../api";

export interface IAuth {
  loading?: boolean;
  message?: string;
  showMessage?: boolean;
  redirect?: string;
  token?: string;
  isAuth?: boolean;
  userActivated?: boolean;
  isRefreshing: boolean;
}
const initState = {
  loading: false,
  message: "",
  showMessage: false,
  redirect: "",
  token: "",
  isAuth: false,
  userActivated: false,
  isRefreshing: false,
};
const auth = (state = initState, action: any) => {
  switch (action.type) {
    case AUTHENTICATED:
      return {
        ...state,
        loading: false,
        redirect: "/",
        token: action.token,
        isAuth: true,
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
      if (new HttpService().company_id) Utils.removeManageToken();
      else Utils.removeToken();
      sessionStorage.clear();
      window.location.reload();
      return {
        ...state,
        token: null,
        redirect: "/auth/login",
        loading: false,
        isAuth: false,
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
    case IS_USER_ACTIVATED:
      return {
        ...state,
        userActivated: action.userActivated,
        activationToken: action.activationToken,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case REDIRECT:
      return {
        ...state,
        redirect: action.payload,
      };
    case SET_IS_REFRESHING:
      return {
        ...state,
        isRefreshing: action.payload,
      };

    default:
      return state;
  }
};

export default auth;
