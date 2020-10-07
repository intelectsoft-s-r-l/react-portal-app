import fetch from "../auth/FetchInterceptor";

const JwtAuthService = {
  login: (data) => {
    return fetch({
      url: "/posts",
      method: "post",
      headers: {
        "public-request": "true",
      },
      data: data,
    });
  },
  signUp: (data) => {
    return fetch({
      url: "/posts",
      method: "post",
      headers: {
        "public-request": "true",
      },
      data: data,
    });
  },
};

export default JwtAuthService;
