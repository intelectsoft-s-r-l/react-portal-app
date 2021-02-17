export const wizardState = {
  wizLoading: false,
  visibleModal: false,
  current: 0,
  termsAccepted: false,
  isAppInstalled: false,
  isAccepted: false,
  selectedApp: null,
};

const wizardReducer = (state = wizardState, action: any) => {
  switch (action.type) {
    case "SHOW_WIZARD":
      return { ...state, visibleModal: true };
    case "HIDE_WIZARD":
      return { ...state, visibleModal: false };
    case "SHOW_LOADING":
      return { ...state, wizLoading: true };
    case "HIDE_LOADING":
      return { ...state, wizLoading: false };
    case "SET_TERMS_ACCEPTED":
      return { ...state, termsAccepted: true };
    case "SET_TERMS_DENIED":
      return { ...state, termsAccepted: false };
    case "SET_APP":
      return { ...state, selectedApp: action.payload };
    case "SET_IS_ACCEPTED":
      return { ...state, isAccepted: !state.isAccepted };
    case "INCREMENT":
      return { ...state, current: state.current + 1 };
    default:
      return state;
  }
};

export default wizardReducer;
