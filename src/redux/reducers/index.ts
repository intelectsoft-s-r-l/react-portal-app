import { combineReducers } from "redux";
import Auth, { IAuth } from "./Auth";
import Theme, { ITheme } from "./Theme";
import Account, { IAccount } from "./Account";
export interface IState {
    theme?: ITheme;
    account?: IAccount;
    auth?: IAuth;
}

const reducers = combineReducers({
    theme: Theme,
    auth: Auth,
    account: Account,
});

export default reducers;
