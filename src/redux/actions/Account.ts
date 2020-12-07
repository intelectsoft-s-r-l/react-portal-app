import {
    CLEAR_INFO,
    REMOVE_AVATAR,
    UPDATE_SETTINGS,
} from "../constants/Account";
import { onLocaleChange } from "./Theme";
import { ClientApi } from "../../api";
import { IUpdateUser, IUser } from "../../api/app_types";
import { ThunkAction } from "redux-thunk";
import { IState } from "../reducers";
import { CHANGE_LOCALE } from "../constants/Theme";

interface IUserResponse {
    Company?: string;
    CompanyID?: number;
    CreateDate?: string;
    Email?: string;
    FirstName?: string;
    ID?: number;
    LastAuthorize?: string;
    LastAuthorizeIP?: string;
    LastName?: string;
    PhoneNumber?: string;
    Photo?: string;
    Status?: number;
    UiLanguage?: number;
}
interface IGetProfileInfo {
    ErrorCode: number;
    ErrorMessage: string;
    User: IUserResponse;
}
type Actions =
    | { type: typeof UPDATE_SETTINGS; payload: IUserResponse }
    | { type: typeof CHANGE_LOCALE; locale: any };
type ThunkResult<R> = ThunkAction<R, IState, undefined, any>;

export const updateSettings = (payload: IUser) => ({
    type: UPDATE_SETTINGS,
    payload,
});

export const clearSettings = () => ({
    type: CLEAR_INFO,
});

export const getProfileInfo = (): ThunkResult<void> => {
    return async (dispatch) => {
        return new ClientApi().GetProfileInfo().then((data: any) => {
            if (data) {
                const { ErrorCode, User } = data as IGetProfileInfo;
                if (ErrorCode === 0) {
                    dispatch({ type: UPDATE_SETTINGS, payload: User });
                    if (User.UiLanguage === 0) {
                        dispatch({ type: CHANGE_LOCALE, locale: "ro" });
                    } else if (User.UiLanguage === 1) {
                        dispatch({ type: CHANGE_LOCALE, locale: "ru" });
                    } else {
                        dispatch({ type: CHANGE_LOCALE, locale: "en" });
                    }
                }
            }
        });
    };
};

export const setProfileInfo = (accountInfo: IUpdateUser): ThunkResult<void> => {
    return async (dispatch) => {
        return new ClientApi().UpdateUser(accountInfo).then((data: any) => {
            if (data) {
                if (data.ErrorCode === 0) {
                    dispatch(getProfileInfo());
                }
            }
        });
    };
};
