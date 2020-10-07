import { UPDATE_SETTINGS } from "../constants/Account";
import { REMOVE_AVATAR } from "../constants/Account";

/* TODO: WRITE TYPES FOR REDUX REDUCERS STATE AND ACTIONS
    29/09/2020 18:01 */
const initialState = {
  avatar: "",
  name: "Admin",
  userName: "Admin",
  email: "admin@edi.md",
  dateOfBirth: "",
  phoneNumber: "",
};

const account = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS:
      return {
        ...state,
        ...action.payload,
      };
    case REMOVE_AVATAR:
      return {
        ...state,
        avatar: "",
      };
    default:
      return state;
  }
};

export default account;
