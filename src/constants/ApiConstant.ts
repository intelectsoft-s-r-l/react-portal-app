export const API_IS_AUTH_SERVICE = "https://dev.edi.md/ISAuthService/json";
// https://api.edi.md/ISAuthService/json PRODUCTION
// https://dev.edi.md/ISAuthService DEVELOPMENT

export const API_AUTHORIZE_USER =
  "https://api.edi.md/ISAuthService/json/AuthorizeUser"; // POST Email, password
export const API_ACTIVATE_USER =
  "https://api.edi.md/ISAuthService/json/ActivateUser?"; // Token={TOKEN}&Code={CODE}
export const API_CHANGE_PASSWORD =
  "https://api.edi.md/ISAuthService/json/ChangePassword"; // POST Oldpassword, Newpassword, Token
export const API_REFRESH_TOKEN =
  "https://api.edi.md/ISAuthService/json/RefreshToken?"; // RToken={RTOKEN}
export const API_REGISTER_COMPANY =
  "https://api.edi.md/ISAuthService/json/RegisterCompany"; // POST Company: {...}, Token: String
export const API_REGISTER_USER =
  "https://api.edi.md/ISAuthService/json/RegisterUser"; /* POST 	
"CompanyID":2147483647,
"Email":"String content",
"FirstName":"String content",
"LastName":"String content",
"Password":"String content",
"PhoneNumber":"String content",
"Photo":"String content",
"UiLanguage":0 */
export const API_RESET_PASSWORD =
  "https://api.edi.md/ISAuthService/json/ResetPasword"; // POST Email
export const API_SENT_ACTIVATE_CODE =
  "https://api.edi.md/ISAuthService/json/SentActivateCode?"; // Token={TOKEN}
export const API_UPDATE_COMPANY =
  "https://api.edi.md/ISAuthService/json/UpdateCompany"; // POST Company: {...}, Token: String
export const API_UPDATE_USER =
  "https://api.edi.md/ISAuthService/json/UpdateUser"; /* POST 	
"CompanyID":2147483647,
"Email":"String content",
"FirstName":"String content",
"LastName":"String content",
"Password":"String content",
"PhoneNumber":"String content",
"Photo":"String content",
"UiLanguage":0 */

export const API_PUBLIC_KEY = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDaVSHFHzNcQmY4KALL2U6QJWDzi73trsb8fd9fL7JrCJe471hjWB7Mg/CN4liv+YEVsigw5xjzo149ZC0YsqG16QlS9poa+vRlCjZDMh3HJowR+8ooZTwzhoyc6SWQYkGj/wFUhll5TWuuuAStAQ+5ds8eWtL5eW0TAWEmRhzOzQIDAQAB`;
