import { SUBDIR_PATH } from "../configs/AppConfig";
import { IState } from "../redux/reducers";

// Pass in Redux store's state to save it to the user's browser local storage
export const saveState = (state: IState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(`${SUBDIR_PATH}`, serializedState);
  } catch {
    // We'll just ignore the errors
  }
};
/* Loads the state and returns an object that can be provided as the
 *  preloadedState parameter of store.js's call to configureStore */
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(`${SUBDIR_PATH}`);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch {
    return undefined;
  }
};
