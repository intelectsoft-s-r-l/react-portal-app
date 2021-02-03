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
import {
  authenticated,
  hideLoading,
  showLoading,
  signOut,
} from "../redux/actions/Auth";
import store from "../redux/store";
import TranslateText from "../utils/translate";
import { ApiResponse, ApiResponseBase } from "./types";
import { IRegisterCompanyRequest, IRegisterUserRequest } from "./types";
const publicIp = require("react-public-ip");

declare module "axios" {
  interface AxiosResponse<T> extends Promise<T> {}
}

class HttpClient {
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
    this.instance.get<ApiResponseBase<ApiResponse, "Token", string>>(
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
    return {
      ...config,
    };
  };

  private _handleResponse = (response: AxiosResponse) => {
    console.log(response);
    if (response.data.ErrorCode === 118) {
      return this._RefreshToken().then(async (data) => {
        if (data && data.ErrorCode === 0) {
          const { Token } = data;
          store.dispatch(authenticated(Token));
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
              store.dispatch(signOut());
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
    store.dispatch(hideLoading());
    if (error && error.request && error.request.status !== 200) {
      message.error({
        content: error.toString(),
        key: "updatable",
        duration: 2.5,
      });
    }
  };
}
export default HttpClient;

export class AuthService extends HttpClient {
  public constructor() {
    super(API_AUTH_URL);
  }

  public Login = async (Email: string, Password: string) =>
    this.instance.post<ApiResponseBase<ApiResponse, "Token", string>>(
      "/AuthorizeUser",
      {
        Email,
        Password,
        info: (await publicIp.v4()) || ("" as string),
      }
    );

  public RegisterCompany = async (data: IRegisterCompanyRequest) =>
    this.instance.post<ApiResponse>("/RegisterCompany", data);

  public SendActivationCode = async () =>
    this.instance.get<ApiResponse>("/SendActivationCode");

  public ResetPassword = async (Email: string) =>
    this.instance.post<ApiResponse>("/ResetPassword", {
      Email,
      info: (await publicIp.v4()) || ("" as string),
    });

  public RegisterUser = async (data: IRegisterUserRequest) =>
    this.instance.post<ApiResponse>("/RegisterUser", data);

  public GetManagedToken = async (CompanyID: number) =>
    this.instance.get<ApiResponseBase<ApiResponse, "Token", string>>(
      "/GetManagedToken",
      {
        params: { CompanyID },
      }
    );

  public ChangePassword = async (NewPassword: string, OldPassword: string) =>
    this.instance.post<ApiResponse>("/ChangePassword", {
      NewPassword,
      OldPassword,
    });

  public ActivateUser = async (Token: string) =>
    this.instance.get<ApiResponse>("/ActivateUser", {
      params: { Token },
    });
}
