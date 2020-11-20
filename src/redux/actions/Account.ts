import { REMOVE_AVATAR, UPDATE_SETTINGS } from "../constants/Account";
import axios from "axios";
import { message } from "antd";
import { onLocaleChange } from "./Theme";
import { signOut } from "./Auth";
import { API_APP_URL } from "../../configs/AppConfig";

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
            .get(`${API_APP_URL}/GetProfileInfo`, {
                params: {
                    Token,
                },
            })
            .then((res) => {
                const { User, ErrorCode, ErrorMessage } = res.data;
                console.log(res.data);
                if (ErrorCode === 0) {
                    dispatch(updateSettings(User));
                    if (User.UiLanguage === 0) {
                        dispatch(onLocaleChange("ro"));
                    } else if (User.UiLanguage === 1) {
                        dispatch(onLocaleChange("ru"));
                    } else {
                        dispatch(onLocaleChange("en"));
                    }
                } else if (ErrorCode === -1) {
                    dispatch(signOut());
                }
            });
    };
};

export const setProfileInfo = (accountInfo) => {
    return async (dispatch) => {
        axios.post(`${API_APP_URL}/UpdateUser`, accountInfo).then((res) => {
            console.log(res.data);
            if (res.data.ErrorCode === 0) {
                const { User } = accountInfo;
                dispatch(updateSettings(User));
            }
        });
    };
};
