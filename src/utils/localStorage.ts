// Pass in Redux store's state to save it to the user's browser local storage
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // We'll just ignore the errors
  }
}
/* Loads the state and returns an object that can be provided as the
*  preloadedState parameter of store.js's call to configureStore */
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch {
    return undefined;
  }
}