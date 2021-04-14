import { applyMiddleware, compose, createStore } from "redux";
import reducers from "../reducers";
import { loadState, saveState } from "../../utils/localStorage";
import throttle from "lodash/throttle";
import thunk from "redux-thunk";

interface IState {
  [key: string]: any;
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

function configureStore(preLoadedState: IState) {
  // const composeEnhancers =
  //   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(reducers, preLoadedState, compose(applyMiddleware(thunk)));
}

const store = configureStore(loadState());

store.subscribe(throttle(() => saveState(store.getState().theme), 1000));

export default store;
