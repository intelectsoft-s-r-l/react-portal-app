import { combineReducers } from "redux";
import Auth from "./Auth";
import Theme from "./Theme";
import Account from "./Account";

const reducers = combineReducers({
  theme: Theme,
  auth: Auth,
  account: Account,
});

export default reducers;
