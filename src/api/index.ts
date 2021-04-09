import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import { message, notification } from "antd";
import { EXPIRE_TIME } from "../constants/Messages";
import store from "../redux/store";
import TranslateText from "../utils/translate";
import { ApiResponse, ApiDecorator } from "./types";
import { AUTHENTICATED, HIDE_LOADING, SIGNOUT } from "../redux/constants/Auth";
import Cookies from "js-cookie";
import { API_AUTH_URL, AUTH_PREFIX_PATH, DOMAIN } from "../configs/AppConfig";
import Utils from "../utils";

export enum EnErrorCode {
  INTERNAL_ERROR = -1,
  NO_ERROR = 0,
  APIKEY_NOT_EXIST = 10,
  EXPIRED_TOKEN = 118,
  INCORECT_AUTH_DATA = 102,
  USER_NOT_ACTIVATED = 108,
}
export enum EnReqStatus {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}

declare module "axios" {
  interface AxiosResponse<T> extends Promise<T> {}
}

class HttpService {
  public readonly instance: AxiosInstance;
  public token: string;
  public company_id: any;
  public _source: CancelTokenSource;

  public constructor(baseURL = "") {
    this.instance = axios.create({
      baseURL,
    });
    this._source = axios.CancelToken.source();
    this.company_id = sessionStorage.getItem("c_id");
    this.token = this.company_id
      ? Cookies.get(`ManageToken_${this.company_id}`)!
      : Cookies.get("Token")!;
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
  private setToken = (Token: string) => {
    this.token = Token;
    // We verify by company_id because managetoken is a cookie and it's shared between tabs
    this.company_id
      ? Utils.setManageToken(`ManageToken_${this.company_id}`, Token)
      : Utils.setToken(Token);
  };
  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      this._handleRequest,
      this._handleRequestError
    );
  };

  private _handleRequest = (config: AxiosRequestConfig) => {
    console.log(config);
    return {
      ...config,
      data: { ...config.data, Token: this.token },
      params: { ...config.params, Token: this.token },
      cancelToken: this._source.token,
    };
  };

  private _handleResponse = async (response: AxiosResponse) => {
    console.log(response);

    if (response.data.ErrorCode === EnErrorCode.EXPIRED_TOKEN) {
      return await this._RefreshToken().then(async (tokenData) => {
        if (tokenData && tokenData.ErrorCode === 0) {
          const { Token } = tokenData;
          this.setToken(Token);
          if (response.config.method === "get") {
            response.config.params = {
              ...response.config.params,
              Token,
            };
            return await this.instance.request(response.config);
          }
          if (response.config.method === "post") {
            response.config.data = {
              ...JSON.parse(response.config.data),
              Token,
            };
            return await this.instance.request(response.config);
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
      response.data.ErrorCode !== EnErrorCode.NO_ERROR &&
      response.data.ErrorCode !== EnErrorCode.EXPIRED_TOKEN &&
      response.data.ErrorCode !== EnErrorCode.INCORECT_AUTH_DATA &&
      response.data.ErrorCode !== EnErrorCode.APIKEY_NOT_EXIST &&
      response.data.ErrorCode !== EnErrorCode.USER_NOT_ACTIVATED
    ) {
      message.error({
        content: `Error: ${response.data.ErrorMessage}`,
        key: "updatable",
        duration: 2.5,
      });
    }
    if (response.data.ErrorCode === EnErrorCode.APIKEY_NOT_EXIST) {
      notification.warning({
        message: `Warning: ${response.data.ErrorMessage}!`,
        description: "Generate a new APIKey in Integration tab!",
        duration: 2.5,
      });
    }

    return response.data;
  };
  private _handleError = async (error: AxiosResponse) => {
    store.dispatch({ type: HIDE_LOADING });
    if (error && error.request && error.request.status !== EnReqStatus.OK) {
      message.error({
        content: error.toString(),
        key: "updatable",
        duration: 2.5,
      });
    }
  };
  private _handleRequestError = (error: any) => Promise.reject(error);
}
export default HttpService;
