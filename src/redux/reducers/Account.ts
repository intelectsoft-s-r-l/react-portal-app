import { CLEAR_INFO, UPDATE_SETTINGS } from "../constants/Account";
import { REMOVE_AVATAR } from "../constants/Account";

export interface IAccount {
    CompanyID?: number;
    Email?: string;
    FirstName?: string;
    ID?: number;
    LastName?: string;
    Password?: string;
    PhoneNumber?: string;
    Photo?: string;
    UiLanguage?: number;
}
const initialState = {
    CompanyID: null,
    Email: "",
    FirstName: null,
    ID: null,
    LastName: null,
    Password: null,
    PhoneNumber: null,
    Photo: null,
    UiLanguage: 0,
};
const account = (state = initialState, action: any) => {
    switch (action.type) {
        case UPDATE_SETTINGS:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export default account;
