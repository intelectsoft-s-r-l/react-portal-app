import { CLEAR_INFO, UPDATE_SETTINGS } from "../constants/Account";
import { REMOVE_AVATAR } from "../constants/Account";

/* TODO: WRITE TYPES FOR REDUX REDUCERS STATE AND ACTIONS
    29/09/2020 18:01 */
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
} as any;

const account = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SETTINGS:
            return {
                ...state,
                ...action.payload,
            };
        case CLEAR_INFO:
            state = null;
        default:
            return state;
    }
};

export default account;
