const dev = {
    API_APP_URL: "https://dev.edi.md/ISClientWebAppService/json",
    API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
};

const prod = {
    API_APP_URL: "https://dev.edi.md/ISClientWebAppService/json",
    API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
};

const test = {
    API_APP_URL: "https://dev.edi.md/ISClientWebAppSerivce/json",
    API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
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
