import fetch from "../auth/FetchInterceptor";

interface IExampleService {
  [key: string]: any;
}
const exampleService = {} as IExampleService;

exampleService.getPost = function (params) {
  return fetch({
    url: "/posts/1",
    method: "get",
    params,
  });
};
exampleService.setPost = function (data) {
  return fetch({
    url: "/posts",
    method: "post",
    data: data,
  });
};

export default exampleService;
