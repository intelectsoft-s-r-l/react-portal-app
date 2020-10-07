import { REMOVE_AVATAR, UPDATE_SETTINGS } from "../constants/Account";

export const updateSettings = (payload) => ({
  type: UPDATE_SETTINGS,
  payload,
});
export const removeAvatar = () => ({
  type: REMOVE_AVATAR,
});
