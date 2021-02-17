import HttpService from "../";
import { API_AUTH_URL } from "../../configs/AppConfig";
import { ApiDecorator, ApiResponse } from "../types";
import { IRegisterCompanyRequest, IRegisterUserRequest } from "./types";
const publicIp = require("react-public-ip");

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
