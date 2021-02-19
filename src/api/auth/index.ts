import { message } from "antd";
import { AxiosResponse } from "axios";
import HttpService, { EnErrorCode } from "../";
import { API_AUTH_URL } from "../../configs/AppConfig";
import { EXPIRE_TIME } from "../../constants/Messages";
import { AUTHENTICATED, SIGNOUT } from "../../redux/constants/Auth";
import store from "../../redux/store";
import TranslateText from "../../utils/translate";
import { ApiDecorator, ApiResponse } from "../types";
import { IRegisterCompanyRequest, IRegisterUserRequest } from "./types";
const publicIp = require("react-public-ip");

declare module "axios" {
  interface AxiosResponse<T> extends Promise<T> {}
}
export class AuthService extends HttpService {
  public constructor() {
    super(API_AUTH_URL);
  }

  public Login = async (Email: string, Password: string) =>
    this.instance.post<ApiDecorator<ApiResponse, "Token", string>>(
      "/AuthorizeUser",
      {
        Email,
        Password,
        info: (await publicIp.v4()) || ("" as string),
      }
    );

  public RegisterCompany = async (data: IRegisterCompanyRequest) =>
    this.instance.post<ApiResponse>("/RegisterCompany", data);

  public SendActivationCode = async (UserID: string) =>
    this.instance.get<ApiResponse>("/SendActivationCode", {
      params: { UserID },
    });

  public ResetPassword = async (Email: string) =>
    this.instance.post<ApiResponse>("/ResetPassword", {
      Email,
      info: (await publicIp.v4()) || ("" as string),
    });

  public RegisterUser = async (data: IRegisterUserRequest) =>
    this.instance.post<ApiResponse>("/RegisterUser", data);

  public GetManagedToken = async (CompanyID: number) =>
    this.instance.get<ApiDecorator<ApiResponse, "Token", string>>(
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
