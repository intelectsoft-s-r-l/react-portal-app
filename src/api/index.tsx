import { message } from "antd";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_APP_URL, API_AUTH_URL } from "../configs/AppConfig";
import { EXPIRE_TIME } from "../constants/Messages";
import { clearSettings } from "../redux/actions/Account";
import { authenticated, hideLoading, signOut } from "../redux/actions/Auth";
import store from "../redux/store";
import {
    ICompany,
    INews,
    INewsData,
    IUpdateCompany,
    IUpdateUser,
} from "./app_types";
import {
    IAuthorizerUser,
    IChangePassword,
    IRegisterCompany,
    IRegisterUser,
} from "./auth_types";
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
        });
    };
    private _RefreshToken = () =>
        this.instance.get(`${API_AUTH_URL}/RefreshToken`);

    public _handleResponse = (response: AxiosResponse) => {
        console.log(response);
        if (response.data.ErrorCode === 118) {
            return this._handleError(response);
        } else if (
            response.data.ErrorCode !== 0 &&
            response.data.ErrorCode !== 118
        ) {
            message.error({
                content: response.data.ErrorMessage,
                key: "updatable",
            });
        }
        return response.data;
    };
    public _handleError = async (error: any) => {
        if (error.config && error.data && error.data.ErrorCode === 118) {
            return this._RefreshToken().then(async (data: any) => {
                const { ErrorCode, Token } = data;
                if (ErrorCode === 0) {
                    store.dispatch(authenticated(Token));
                    if (error.config.method === "get") {
                        error.config.params = {
                            ...error.config.params,
                            Token,
                        };
                        return await axios
                            .request(error.config)
                            .then((response) => response.data);
                    }
                    if (error.config.method === "post") {
                        error.config.data = {
                            ...JSON.parse(error.config.data),
                            Token,
                        };
                        return await axios
                            .request(error.config)
                            .then((response) => response.data);
                    }
                } else {
                    const key = "updatable";
                    message.loading({ content: EXPIRE_TIME, key }).then(() => {
                        store.dispatch(signOut());
                        // store.dispatch(clearSettings());
                    });
                }
            });
        }
        store.dispatch(hideLoading());
    };
}
export class AuthApi extends HttpClient {
    public constructor() {
        super(`${API_AUTH_URL}`);
    }

    public Login = async (data: IAuthorizerUser) =>
        this.instance.post("/AuthorizeUser", {
            ...data,
            info: (await publicIp.v4()) || ("" as string),
        });

    public RegisterCompany = (data: IRegisterCompany) =>
        this.instance.post("/RegisterCompany", data);

    public SendActivationCode = () => this.instance.get("/SendActivationCode");

    public ResetPassword = async (Email: string) =>
        this.instance.post("/ResetPassword", {
            Email,
            info: (await publicIp.v4()) || ("" as string),
        });

    public RegisterUser = (data: IRegisterUser) =>
        this.instance.post("/RegisterUser", data);

    public GetManagedToken = (CompanyID: number) =>
        this.instance.get("/GetManagedToken", {
            params: { CompanyID },
        });

    public ChangePassword = (data: IChangePassword) =>
        this.instance.post("/ChangePassword", data);

    public ActivateUser = (params: string) =>
        this.instance.get("/ActivateUser", {
            params,
        });
}

export class ClientApi extends HttpClient {
    public constructor() {
        super(`${API_APP_URL}`);
    }
    public GetProfileInfo = () => this.instance.get("/GetProfileInfo");
    public UpdateUser = async (data: IUpdateUser) =>
        this.instance.post("/UpdateUser", data);

    public GetMarketAppList = () => this.instance.get("/GetMarketAppList");

    public DeactivateApp = (AppID: number) =>
        this.instance.post("/DeactivateApp", {
            AppID,
        });

    public ActivateApp = (AppID: number) =>
        this.instance.post("/ActivateApp", {
            AppID,
        });

    public GetAppLicenses = (AppType: number) =>
        this.instance.get("/GetAppLicensesList", {
            params: {
                AppType,
            },
        });

    public RequestLicense = (AppType: number, Quantity: number) =>
        this.instance.get("/RequestAppLicense", {
            params: { AppType, Quantity },
        });

    public ReleaseLicense = (LicenseID: number) =>
        this.instance.get("/ReleaseAppLicense", {
            params: { LicenseID },
        });

    public DeleteLicense = (LicenseID: number) =>
        this.instance.get("/DeleteAppLicense", {
            params: { LicenseID },
        });

    public GenerateApiKey = (AppID: number) =>
        this.instance.post("/GenerateApiKey", {
            AppID,
        });

    public DeleteApiKey = (AppID: number) =>
        this.instance.post("/DeleteApiKey", {
            AppID,
        });

    public GenerateLicenseActivationCode = (AppID: number) =>
        this.instance.post("/GenerateLicenseActivationCode", {
            AppID,
        });

    public GetUserList = () => this.instance.get("/GetUsersInfo");

    public GetCompanyInfo = () => this.instance.get("/GetCompanyInfo");

    public UpdateCompany = async (data: ICompany) =>
        this.instance.post("/UpdateCompany", {
            ...data,
            info: await publicIp.v4(),
        });

    public ChangeUserStatus = (ID: number, Status: number) =>
        this.instance.get("/ChangeUserStatus", {
            params: {
                ID,
                Status,
            },
        });

    public GetNews = (AppType: number) =>
        this.instance.get("/GetNews", {
            params: {
                AppType,
            },
        });

    public UpdateNews = (NewsData: INewsData) =>
        this.instance.post("/UpdateNews", {
            NewsData,
        });
}
