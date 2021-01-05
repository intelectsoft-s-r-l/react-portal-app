import { message } from "antd";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_APP_URL, API_AUTH_URL, API_SMS_URL } from "../configs/AppConfig";
import { EXPIRE_TIME } from "../constants/Messages";
import { authenticated, hideLoading, signOut } from "../redux/actions/Auth";
import store from "../redux/store";
import WithStringTranslate from "../utils/translate";
import {
  IActivateUserRequest,
  IAuthorizeUserRequest,
  IChangePasswordRequest,
  IRegisterCompanyRequest,
  IRegisterUserRequest,
  ISMSReviewerUpdateRequest,
  ISMSSendSMSRequest,
  IUpdateAppRequest,
  IUpdateCompanyRequest,
} from "./types.request";
import {
  ApiResponse,
  IAuthorizeUserResponse,
  ICampaignList,
  IGenerateApiKeyResponse,
  IGenerateLicenseActivationCodeResponse,
  IGenerateRsaKeyResponse,
  IGetAllUsersInfoResponse,
  IGetAppLicensesList,
  IGetCompanyInfoResponse,
  IGetManagedTokenResponse,
  IGetMarketAppListResponse,
  IGetNewsResponse,
  IGetProfileInfoResponse,
  INewsList,
  IRefreshTokenResponse,
  IRegisterUserResponse,
  IResetPasswordResponse,
  ISendActivationCodeResponse,
  ISMSGetCampaignResponse,
  ISMSInfoGetByPeriodResponse,
  ISMSInfoGetDetailByPeriodResponse,
  ISMSInfoResponse,
  IUsers,
} from "./types.response";
const publicIp = require("react-public-ip");

declare module "axios" {
  interface AxiosResponse<T> extends Promise<T> {}
}
class HttpClient {
  public readonly instance: AxiosInstance;
  public _token: string;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });
    this._token = store.getState().auth.token;
    this._initializeResponseInterceptor();
    this._initializeRequestInterceptor();
  }

  public _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };
  public _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      (config) => {
        console.log(config);
        if (config.method === "get" && config.baseURL !== API_SMS_URL) {
          config.params = {
            ...config.params,
            Token: this._token,
          };
        }
        if (config.method === "post" && config.baseURL !== API_SMS_URL) {
          config.data = {
            ...config.data,
            Token: this._token,
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  };
  private _RefreshToken = async () =>
    this.instance.get<IRefreshTokenResponse>(`${API_AUTH_URL}/RefreshToken`);

  public _handleResponse = (response: AxiosResponse) => {
    console.log(response);
    if (response.data.ErrorCode === 118) {
      return this._RefreshToken().then(async (data) => {
        if (data) {
          const { ErrorCode, Token } = data;
          if (ErrorCode === 0) {
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
                content: WithStringTranslate(EXPIRE_TIME),
                key,
                duration: 1.5,
              })
              .then(() => {
                store.dispatch(signOut());
              });
          }
        }
      });
    } else if (
      response.data.ErrorCode !== 0 &&
      response.data.ErrorCode !== 108 &&
      response.data.ErrorCode !== -1
    ) {
      message.error({
        content: response.data.ErrorMessage,
        key: "updatable",
      });
    }
    if (response.data) {
      return response.data;
    }
  };
  public _handleError = async (error: AxiosResponse) => {
    if (error.request.status !== 200) {
      message.error({
        content: error.toString(),
        key: "updatable",
        duration: 10,
      });
    }
    store.dispatch(hideLoading());
  };
}
export class AuthService extends HttpClient {
  public constructor() {
    super(`${API_AUTH_URL}`);
  }

  public Login = async (data: IAuthorizeUserRequest) =>
    this.instance.post<IAuthorizeUserResponse>("/AuthorizeUser", {
      ...data,
      info: (await publicIp.v4()) || ("" as string),
    });

  public RegisterCompany = async (data: IRegisterCompanyRequest) =>
    this.instance.post<IAuthorizeUserResponse>("/RegisterCompany", data);

  public SendActivationCode = async () =>
    this.instance.get<ISendActivationCodeResponse>("/SendActivationCode");

  public ResetPassword = async (Email: string) =>
    this.instance.post<IResetPasswordResponse>("/ResetPassword", {
      Email,
      info: (await publicIp.v4()) || ("" as string),
    });

  public RegisterUser = async (data: IRegisterUserRequest) =>
    this.instance.post<IRegisterUserResponse>("/RegisterUser", data);

  public GetManagedToken = async (CompanyID: number) =>
    this.instance.get<IGetManagedTokenResponse>("/GetManagedToken", {
      params: { CompanyID },
    });

  public ChangePassword = async (data: IChangePasswordRequest) =>
    this.instance.post<ApiResponse>("/ChangePassword", data);

  public ActivateUser = async (params: IActivateUserRequest) =>
    this.instance.get<ApiResponse>("/ActivateUser", {
      params,
    });
}

export class AppService extends HttpClient {
  public constructor() {
    super(`${API_APP_URL}`);
  }
  public GetProfileInfo = async () =>
    this.instance.get<IGetProfileInfoResponse>("/GetProfileInfo");
  public UpdateUser = async (data: IUsers) =>
    this.instance.post<ApiResponse>("/UpdateUser", data);

  public GetMarketAppList = async () =>
    this.instance.get<IGetMarketAppListResponse>("/GetMarketAppList");

  public DeactivateApp = async (AppID: number) =>
    this.instance.post<ApiResponse>("/DeactivateApp", {
      AppID,
    });

  public ActivateApp = async (AppID: number) =>
    this.instance.post<ApiResponse>("/ActivateApp", {
      AppID,
    });

  public GetAppLicenses = async (AppType: number) =>
    this.instance.get<IGetAppLicensesList>("/GetAppLicensesList", {
      params: {
        AppType,
      },
    });

  public RequestLicense = async (AppType: number, Quantity: number) =>
    this.instance.get<ApiResponse>("/RequestAppLicense", {
      params: { AppType, Quantity },
    });

  public ReleaseLicense = async (LicenseID: string) =>
    this.instance.get<ApiResponse>("/ReleaseAppLicense", {
      params: { LicenseID },
    });

  public DeleteLicense = async (LicenseID: string) =>
    this.instance.get<ApiResponse>("/DeleteAppLicense", {
      params: { LicenseID },
    });

  public GenerateApiKey = async (AppID: number) =>
    this.instance.post<IGenerateApiKeyResponse>("/GenerateApiKey", {
      AppID,
    });

  public GenerateRsaKey = async (AppID: number) =>
    this.instance.post<IGenerateRsaKeyResponse>("/GenerateRsaKey", {
      AppID,
    });
  public UpdateRsaKey = async (AppID: number, Key: string, KeyType: number) =>
    this.instance.post("/UpdateRsaKey", {
      AppID,
      Key,
      KeyType,
    });

  public DeleteApiKey = async (AppID: number) =>
    this.instance.post("/DeleteApiKey", {
      AppID,
    });

  public GenerateLicenseActivationCode = async (AppID: number) =>
    this.instance.post<IGenerateLicenseActivationCodeResponse>(
      "/GenerateLicenseActivationCode",
      {
        AppID,
      }
    );

  public GetUserList = async () =>
    this.instance.get<IGetAllUsersInfoResponse>("/GetUsersInfo");

  public GetCompanyInfo = async () =>
    this.instance.get<IGetCompanyInfoResponse>("/GetCompanyInfo");

  public UpdateCompany = async (data: IUpdateCompanyRequest) =>
    this.instance.post<ApiResponse>("/UpdateCompany", {
      ...data,
      info: await publicIp.v4(),
    });

  public ChangeUserStatus = async (ID: number, Status: number) =>
    this.instance.get<ApiResponse>("/ChangeUserStatus", {
      params: {
        ID,
        Status,
      },
    });

  public GetAppNews = async (AppType: number) =>
    this.instance.get<IGetNewsResponse>("/GetAppNews", {
      params: {
        AppType,
      },
    });

  public UpdateNews = async (NewsData: INewsList) =>
    this.instance.post<ApiResponse>("/UpdateAppNews", {
      NewsData,
    });

  public UpdateApp = async (AppData: IUpdateAppRequest) =>
    this.instance.post<ApiResponse>("/UpdateApp", {
      ...AppData,
    });

  public GetPortalNews = async (ProductType: number) =>
    this.instance.get<IGetNewsResponse>("/GetPortalNews", {
      params: {
        ProductType,
      },
    });

  public SMS_GetCampaign = async () =>
    this.instance.get<ISMSGetCampaignResponse>("/SMS/SMSGetCampaign");

  public SMS_DeleteCampaign = async (ID: number) =>
    this.instance.get<ApiResponse>("/SMS/DeleteCampaign", {
      params: {
        ID,
      },
    });

  public SMS_ReviewerUpdate = async (reviewerInfo: ISMSReviewerUpdateRequest) =>
    this.instance.post<ApiResponse>("/SMS/ReviewerUpdate", {
      ...reviewerInfo,
    });

  public SMS_UpdateCampaign = async (campaignInfo: ICampaignList) =>
    this.instance.post<ApiResponse>("/SMS/UpdateCampaign", {
      ...campaignInfo,
    });
}

export class SmsService extends HttpClient {
  public constructor() {
    super(`${API_SMS_URL}`);
  }

  public CheckApiKey = async (APIKey: number) =>
    this.instance.get<ApiResponse>("/CheckApiKey", {
      params: {
        APIKey,
      },
    });

  public GetInfo = async () => this.instance.get<ISMSInfoResponse>("/GetInfo");

  public Info_GetByPeriod = async (
    APIKey: string,
    DateStart: string,
    DateEnd: string
  ) =>
    this.instance.get<ISMSInfoGetByPeriodResponse>("/Info/GetByPeriod", {
      params: {
        APIKey,
        DateStart,
        DateEnd,
      },
    });

  public Info_GetDetailByPeriod = async (
    APIKey: string,
    DateStart: string,
    DateEnd: string
  ) =>
    this.instance.get<ISMSInfoGetDetailByPeriodResponse>(
      "/Info/GetDetailByPeriond",
      {
        params: {
          APIKey,
          DateStart,
          DateEnd,
        },
      }
    );

  public Info_GetTotal = async (APIKey: string) =>
    this.instance.get<ISMSInfoResponse>("info/GetTotal", {
      params: {
        APIKey,
      },
    });

  public SendSMS = async (data: ISMSSendSMSRequest) =>
    this.instance.post<ApiResponse>("/SendSMS", {
      ...data,
    });

  public SendSMSByPhoneList = async (data: ISMSSendSMSRequest) =>
    this.instance.post<ApiResponse>("/SendSMSByPhoneList", {
      ...data,
    });
}
