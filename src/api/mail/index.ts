import HttpService from "../";
import { AxiosRequestConfig } from "axios";
import { API_MAIL_URL } from "../../configs/AppConfig";
import { ApiDecorator, ApiResponse } from "../types";
import { IMail, ITemplate } from "./types";

type TokenResponse = ApiDecorator<ApiResponse, "Token", string>;
export class MailService extends HttpService {
  public constructor() {
    super(API_MAIL_URL);
    this.interceptRequest();
  }
  private interceptRequest = () => {
    this.instance.interceptors.request.use((config: AxiosRequestConfig) => {
      return {
        ...config,
        auth: { username: "1", password: "1" },
      };
    });
  };

  public SendMail = async (data: IMail) =>
    this.instance.post<TokenResponse>("/SendMail", data);

  public UpdateTemplate = async (data: ITemplate) =>
    this.instance.post<TokenResponse>("/UpdateTemplate", data);

  public GetTemplates = async (APIKey: string) =>
    this.instance.get<ApiDecorator<ApiResponse, "Templates", ITemplate[]>>(
      "/GetTemplates",
      {
        params: { APIKey },
      }
    );
}
