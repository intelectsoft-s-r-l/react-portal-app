import { message } from "antd";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_APP_URL, API_AUTH_URL } from "../configs/AppConfig";
import { EXPIRE_TIME } from "../constants/Messages";
import { authenticated, hideLoading, signOut } from "../redux/actions/Auth";
import store from "../redux/store";
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
                    message
                        .loading({ content: EXPIRE_TIME, key })
                        .then(() => store.dispatch(signOut()));
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

    public Login = async (data) =>
        this.instance.post("/AuthorizeUser", {
            ...data,
            info: (await publicIp.v4()) || ("" as string),
        });

    public RegisterCompany = (data) =>
        this.instance.post("/RegisterCompany", data);

    public RefreshToken = () => this.instance.get("/RefreshToken");

    public SendActivationCode = () => this.instance.get("/SendActivationCode");

    public ResetPassword = async (Email) =>
        this.instance.post("/ResetPassword", {
            Email,
            info: (await publicIp.v4()) || "",
        });

    public RegisterUser = (data) => this.instance.post("/RegisterUser", data);

    public GetManagedToken = (CompanyID) =>
        this.instance.get("/GetManagedToken", {
            params: { CompanyID },
        });

    public ChangePassword = (data) =>
        this.instance.post("/ChangePassword", data);

    public ActivateUser = (params) =>
        this.instance.get("/ActivateUser", {
            params,
        });
}

export class ClientApi extends HttpClient {
    public constructor() {
        super(`${API_APP_URL}`);
    }
    public GetProfileInfo = () => this.instance.get("/GetProfileInfo");
    public UpdateUser = async (data) => this.instance.post("/UpdateUser", data);

    public GetMarketAppList = () => this.instance.get("/GetMarketAppList");

    public DeactivateApp = (AppID) =>
        this.instance.post("/DeactivateApp", {
            AppID,
            Token: this._token,
        });

    public ActivateApp = (AppID) =>
        this.instance.post("/ActivateApp", {
            AppID,
            Token: this._token,
        });

    public GetAppLicenses = (AppType) =>
        this.instance.get("/GetAppLicensesList", {
            params: {
                AppType,
            },
        });

    public RequestLicense = (AppType, Quantity) =>
        this.instance.get("/RequestAppLicense", {
            params: { AppType, Quantity },
        });

    public ReleaseLicense = (LicenseID) =>
        this.instance.get("/ReleaseAppLicense", {
            params: { LicenseID },
        });

    public DeleteLicense = (LicenseID) =>
        this.instance.get("/DeleteAppLicense", {
            params: { LicenseID },
        });

    public GenerateApiKey = (AppID) =>
        this.instance.post("/GenerateApiKey", {
            AppID,
            Token: this._token,
        });

    public DeleteApiKey = (AppID) =>
        this.instance.post("/DeleteApiKey", {
            AppID,
            Token: this._token,
        });

    public GenerateLicenseActivationCode = (AppID) =>
        this.instance.post("/GenerateLicenseActivationCode", {
            AppID,
            Token: this._token,
        });

    public GetUserList = () => this.instance.get("/GetUsersInfo");

    public GetCompanyInfo = () => this.instance.get("/GetCompanyInfo");

    public UpdateCompany = async (data) =>
        this.instance.post("/UpdateCompany", {
            ...data,
            Token: this._token,
            info: await publicIp.v4(),
        });

    public ChangeUserStatus = (ID, Status) =>
        this.instance.get("/ChangeUserStatus", {
            params: {
                ID,
                Status,
            },
        });
}
