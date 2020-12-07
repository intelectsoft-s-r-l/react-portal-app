import { combineReducers } from "redux";
import Auth from "./Auth";
import Theme, { ITheme } from "./Theme";
import Account from "./Account";
export interface IState {
    theme?: ITheme;
    account?: { [key: string]: any };
    auth?: { [key: string]: any };
}

const reducers = combineReducers({
    theme: Theme,
    auth: Auth,
    account: Account,
});

export default reducers;
