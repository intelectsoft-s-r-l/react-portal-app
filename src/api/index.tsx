import { message } from "antd";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_APP_URL, API_AUTH_URL } from "../configs/AppConfig";
import { EXPIRE_TIME } from "../constants/Messages";
import { authenticated, hideLoading, signOut } from "../redux/actions/Auth";
import store from "../redux/store";
import WithStringTranslate from "../utils/translate";
import { IActivateUserRequest, IAuthorizeUserRequest, IChangePasswordRequest, IRegisterCompanyRequest, IRegisterUserRequest, IUpdateAppRequest, IUpdateNewsRequest } from "./types.request";
import { IActivateUserResponse, IAuthorizeUserResponse, IChangePasswordResponse, IChangeUserStatusResponse, ICompanyData,  IDeactivateAppResponse, IDeleteAppLicenseResponse, IGenerateApiKeyResponse, IGenerateLicenseActivationCodeResponse, IGetAppLicensesList, IGetManagedTokenResponse, IGetProfileInfoResponse, IMarketAppList, INewsList, IRegisterUserResponse, IReleaseLicenseResponse, IRequestLicenseResponse, IResetPasswordResponse, ISendActivationCodeResponse, IUpdateCompanyResponse, IUpdateUserResponse, IUsers } from "./types.response";
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
        this.instance.interceptors.request.use((config) => {
            console.log(config);
            if (config.method === "get") {
                config.params = {
                    ...config.params,
                    Token: this._token,
                };
            }
            if (config.method === "post") {
                config.data = {
                    ...config.data,
                    Token: this._token,
                };
            }
            return config;
        }, (error) => Promise.reject(error));
    };
    private _RefreshToken = () =>
        this.instance.get(`${API_AUTH_URL}/RefreshToken`);

    public _handleResponse = (response: AxiosResponse) => {
        console.log(response);
        if (response.data.ErrorCode === 118) {
            return this._RefreshToken().then(async (data: any) => {
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
            });
        } else if (
            response.data.ErrorCode !== 0 &&
            response.data.ErrorCode !== 108
        ) {
            message.error({
                content: response.data.ErrorMessage,
                key: "updatable",
            });
        }
        return response.data;
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
export class AuthApi extends HttpClient {
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

    public SendActivationCode = async () => this.instance.get<ISendActivationCodeResponse>("/SendActivationCode");

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
        this.instance.post<IChangePasswordResponse>("/ChangePassword", data);

    public ActivateUser = async (params: IActivateUserRequest) =>
        this.instance.get<IActivateUserResponse>("/ActivateUser", {
            params,
        });
}

export class ClientApi extends HttpClient {
    public constructor() {
        super(`${API_APP_URL}`);
    }
    public GetProfileInfo = async () => this.instance.get<IGetProfileInfoResponse>("/GetProfileInfo");
    public UpdateUser = async (data: IUsers) =>
        this.instance.post<IUpdateUserResponse>("/UpdateUser", data);

    public GetMarketAppList = async () => this.instance.get<IMarketAppList>("/GetMarketAppList");

    public DeactivateApp = async (AppID: number) =>
        this.instance.post<IDeactivateAppResponse>("/DeactivateApp", {
            AppID,
        });

    public ActivateApp = async (AppID: number) =>
        this.instance.post<IDeactivateAppResponse>("/ActivateApp", {
            AppID,
        });

    public GetAppLicenses = async (AppType: number) =>
        this.instance.get<IGetAppLicensesList>("/GetAppLicensesList", {
            params: {
                AppType,
            },
        });

    public RequestLicense = async (AppType: number, Quantity: number) =>
        this.instance.get<IRequestLicenseResponse>("/RequestAppLicense", {
            params: { AppType, Quantity },
        });

    public ReleaseLicense = async (LicenseID: number) =>
        this.instance.get<IReleaseLicenseResponse>("/ReleaseAppLicense", {
            params: { LicenseID },
        });

    public DeleteLicense = async (LicenseID: number) =>
        this.instance.get<IDeleteAppLicenseResponse>("/DeleteAppLicense", {
            params: { LicenseID },
        });

    public GenerateApiKey = async (AppID: number) =>
        this.instance.post<IGenerateApiKeyResponse>("/GenerateApiKey", {
            AppID,
        });

    public DeleteApiKey = async (AppID: number) =>
        this.instance.post("/DeleteApiKey", {
            AppID,
        });

    public GenerateLicenseActivationCode = async (AppID: number) =>
        this.instance.post<IGenerateLicenseActivationCodeResponse>("/GenerateLicenseActivationCode", {
            AppID,
        });

    public GetUserList = async () => this.instance.get<IUsers>("/GetUsersInfo");

    public GetCompanyInfo = async () => this.instance.get<ICompanyData>("/GetCompanyInfo");

    public UpdateCompany = async (data: ICompanyData) =>
        this.instance.post<IUpdateCompanyResponse>("/UpdateCompany", {
            ...data,
            info: await publicIp.v4(),
        });

    public ChangeUserStatus = async (ID: number, Status: number) =>
        this.instance.get<IChangeUserStatusResponse>("/ChangeUserStatus", {
            params: {
                ID,
                Status,
            },
        });

    public GetAppNews = async (AppType: number) =>
        this.instance.get<INewsList>("/GetAppNews", {
            params: {
                AppType,
            },
        });

    public UpdateNews = async (NewsData: IUpdateNewsRequest['NewsData']) =>
        this.instance.post("/UpdateAppNews", {
            NewsData,
        });

    public UpdateApp = async (AppData: IUpdateAppRequest) =>
        this.instance.post("/UpdateApp", {
            ...AppData,
        });

    public GetPortalNews = async (ProductType: number) =>
        this.instance.get("/GetPortalNews", {
            params: {
                ProductType,
            },
        });
}

export class fakeAPI extends HttpClient {
    constructor() {
        super("http://api/mock.io/v1");
    }
    public FakePostCall = () => this.instance.post("/979095de");
}
