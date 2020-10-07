const dev = {
  API_ENDPOINT_URL: "https://jsonplaceholder.typicode.com",
  // API_PUBLIC_KEY:
  // 	"MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgEk86qvmSxEIFnv7ee9qN/2YuSzb\nrtyv7MOC+ab1fPXcWBNawth1jOCN8lBhTOypUT/ScoHz/Ag7fByrP7NqoQHr6ike\nZ1bBYlRXhi/V64oeBHuxoi9ApVsIDQ2iYyxYNpfMX5NwRxZu0SZH7i69rlxKadId\nF8Qp9wzyJT3O8tOLAgMBAAE=",
};

const prod = {
  API_ENDPOINT_URL: "https://api.prod.com",
};

const test = {
  API_ENDPOINT_URL: "https://api.test.com",
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
