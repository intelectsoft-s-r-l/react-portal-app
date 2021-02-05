import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import { message } from "antd";
import {
  API_APP_URL,
  API_AUTH_URL,
  API_DISCOUNT_URL,
  API_EDX_URL,
  API_SMS_URL,
} from "../configs/AppConfig";
import { EXPIRE_TIME } from "../constants/Messages";
import store from "../redux/store";
import TranslateText from "../utils/translate";
import { ApiResponse, ApiDecorator } from "./types";
import { AUTHENTICATED, HIDE_LOADING, SIGNOUT } from "../redux/constants/Auth";

declare module "axios" {
  interface AxiosResponse<T> extends Promise<T> {}
}

class HttpService {
  public readonly instance: AxiosInstance;
  private _token: string;
  public _source: CancelTokenSource;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });
    this._source = axios.CancelToken.source();
    this._token = store.getState().auth.token;
    this._initializeResponseInterceptor();
    this._initializeRequestInterceptor();
  }
  private _RefreshToken = async () =>
    this.instance.get<ApiDecorator<ApiResponse, "Token", string>>(
      `${API_AUTH_URL}/RefreshToken`
    );

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };
  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(this._handleRequest, (error) =>
      Promise.reject(error)
    );
  };
  private _handleRequest = (config: AxiosRequestConfig) => {
    console.log(config);
    if (
      config.method === "get" &&
      config.baseURL !== API_SMS_URL &&
      config.baseURL !== API_DISCOUNT_URL &&
      config.baseURL !== API_EDX_URL
    ) {
      config.params = {
        ...config.params,
        Token: this._token,
      };
    }
    if (
      config.method === "post" &&
      config.baseURL !== API_SMS_URL &&
      config.baseURL !== API_DISCOUNT_URL &&
      config.baseURL !== API_EDX_URL
    ) {
      config.data = {
        ...config.data,
        Token: this._token,
      };
    }
    if (config.baseURL === API_DISCOUNT_URL || config.baseURL === API_EDX_URL) {
      config.auth = {
        username: "1",
        password: "1",
      };
    }

    config.cancelToken = this._source.token;
    return config;
  };

  private _handleResponse = (response: AxiosResponse) => {
    console.log(response);
    if (response.data.ErrorCode === 118) {
      return this._RefreshToken().then(async (data) => {
        if (data && data.ErrorCode === 0) {
          const { Token } = data;
          store.dispatch({ type: AUTHENTICATED, token: Token });
          if (response.config.method === "get") {
            response.config.params = {
              ...response.config.params,
              Token,
            };
            return await axios
              .request(response.config)
              .then((response) => response.data);
          }
          if (response.config.method === "post") {
            response.config.data = {
              ...JSON.parse(response.config.data),
              Token,
            };
            return await axios
              .request(response.config)
              .then((response) => response.data);
          }
        } else {
          const key = "updatable";
          message
            .loading({
              content: TranslateText(EXPIRE_TIME),
              key,
              duration: 1.5,
            })
            .then(() => {
              store.dispatch({ type: SIGNOUT });
            });
        }
      });
    } else if (
      response.data.ErrorCode !== 0 &&
      response.data.ErrorCode !== 108 &&
      response.data.ErrorCode !== -1 &&
      response.data.ErrorCode !== 102
    ) {
      message.error({
        content: response.data.ErrorMessage,
        key: "updatable",
        duration: 2.5,
      });
    }
    return response.data;
  };
  private _handleError = async (error: AxiosResponse) => {
    store.dispatch({ type: HIDE_LOADING });
    if (error && error.request && error.request.status !== 200) {
      message.error({
        content: error.toString(),
        key: "updatable",
        duration: 2.5,
      });
    }
  };
}
export default HttpService;
