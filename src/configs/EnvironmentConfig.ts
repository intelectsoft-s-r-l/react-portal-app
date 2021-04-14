const dev = {
  API_APP_URL: "https://dev.edi.md/ISClientWebAppService/json",
  API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
  API_SMS_URL: "https://dev.edi.md/SMSService/json",
  API_DISCOUNT_URL: "https://dev.edi.md/ISDiscountService/json",
  API_EDX_URL: "https://dev.edi.md/EDXService/json",
  API_MAIL_URL: "https://dev.edi.md/ISMailService/json",
  API_BILL_URL: "https://dev.edi.md/ISBillService/json",
  SMS_URL_VALIDATE: "http://localhost.com:3002/auth/validate",
  SUBDIR_PATH: "/clientportal",
  DOMAIN: "localhost.com",
};

const prod = {
  API_APP_URL: "https://api.edi.md/ISClientWebAppService/json",
  API_AUTH_URL: "https://api.edi.md/ISAuthService/json",
  API_SMS_URL: "https://api.edi.md/SMSService/json",
  API_DISCOUNT_URL: "https://api.edi.md/ISDiscountService/json",
  API_EDX_URL: "https://api.edi.md/EDXService/json",
  API_MAIL_URL: "https://api.edi.md/ISMailService/json",
  API_BILL_URL: "https://dev.edi.md/ISBillService/json",
  SMS_URL_VALIDATE: "https://sms.eservicii.md/auth/validate",
  SUBDIR_PATH: "/clientportal",
  DOMAIN: "eservicii.md",
};

const test = {
  API_APP_URL: "https://dev.edi.md/ISClientWebAppService/json",
  API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
  API_SMS_URL: "https://dev.edi.md/SMSService/json",
  API_DISCOUNT_URL: "https://dev.edi.md/ISDiscountService/json",
  API_EDX_URL: "https://dev.edi.md/EDXService/json",
  API_MAIL_URL: "https://dev.edi.md/ISMailService/json",
  API_BILL_URL: "https://dev.edi.md/ISBillService/json",
  SMS_URL_VALIDATE: "https://testsms.eservicii.md/auth/validate",
  SUBDIR_PATH: "/testclientportal",
  DOMAIN: "eservicii.md",
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
