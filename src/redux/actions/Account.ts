import {
  API_IS_CLIENT_SERVICE,
  API_IS_AUTH_SERVICE,
} from "../../constants/ApiConstant";
import { REMOVE_AVATAR, UPDATE_SETTINGS } from "../constants/Account";
import axios from "axios";
import { message } from "antd";

export const updateSettings = (payload) => ({
  type: UPDATE_SETTINGS,
  payload,
});
export const removeAvatar = () => ({
  type: REMOVE_AVATAR,
});

export const getProfileInfo = (Token) => {
  return async (dispatch) => {
    axios
      .get(`${API_IS_CLIENT_SERVICE}/GetProfileInfo`, {
        params: {
          Token,
        },
      })
      .then((res) => {
        const { User, ErrorCode, ErrorMessage } = res.data;
        if (ErrorCode === 0) {
          dispatch(updateSettings(User));
        }
      });
  };
};

export const getCompanyInfo = (Token) => {
  axios
    .get(`${API_IS_CLIENT_SERVICE}/GetCompanyInfo`, {
      params: {
        Token,
      },
    })
    .then((res) => {
      const { ErrorCode, ErrorMessage, Company } = res.data;
      console.log(res.data);
      if (ErrorCode === 0) {
        return Company;
      } else {
        message.error(ErrorMessage);
      }
    });
};

export const setCompanyInfo = (companyInfo) => {
  return async (dispatch) => {};
};

export const setProfileInfo = (accountInfo) => {
  return async (dispatch) => {
    axios
      .post(`${API_IS_CLIENT_SERVICE}/UpdateUser`, accountInfo)
      .then((res) => {
        if (res.data.ErrorCode === 0) {
          const { User } = accountInfo;
          dispatch(updateSettings(User));
        }
      });
  };
};
