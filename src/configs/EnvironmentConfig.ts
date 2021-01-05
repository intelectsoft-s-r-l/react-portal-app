const dev = {
  API_APP_URL: "https://dev.edi.md/ISClientWebAppService/json",
  API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
  API_SMS_URL: "https://api.edi.md/SMSService/json",
  SUBDIR_PATH: "/clientportal",
};

const test = {
  API_APP_URL: "https://api.edi.md/ISClientWebAppService/json",
  API_AUTH_URL: "https://api.edi.md/ISAuthService/json",
  API_SMS_URL: "https://api.edi.md/SMSService/json",
  SUBDIR_PATH: "/clientportal",
};

const prod = {
  API_APP_URL: "https://api.edi.md/ISClientWebAppService/json",
  API_AUTH_URL: "https://api.edi.md/ISAuthService/json",
  API_SMS_URL: "https://api.edi.md/SMSService/json",
  SUBDIR_PATH: "/testclientportal",
};

const getEnv = () => {
  switch (process.env.NODE_ENV) {
    case "development":
      return dev;
    case "production":
      return prod;
    case "test":
      return test;
    default:
      break;
  }
};

export const env = getEnv();
