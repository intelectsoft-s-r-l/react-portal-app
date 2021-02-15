import HttpService from "../HttpService";
import { API_APP_URL } from "../../configs/AppConfig";
import { IAccount } from "../../redux/reducers/Account";
import { IUpdateAppRequest, IUpdateCompanyRequest } from "./types";
import { ApiResponse, ApiDecorator } from "../types";
import {
  ICampaignList,
  ICompanyData,
  ILicenses,
  IMarketAppList,
  INewsList,
  ISMSReviewerUpdateRequest,
  IRsaKeys,
  IShortMarketAppList,
  IUsers,
} from "./types";
const publicIp = require("react-public-ip");

export class AppService extends HttpService {
  public constructor() {
    super(API_APP_URL);
  }
  public GetProfileInfo = async () =>
    this.instance.get<ApiDecorator<ApiResponse, "User", IUsers>>(
      "/GetProfileInfo"
    );
  public UpdateUser = async (data: { User: IAccount }) =>
    this.instance.post<ApiResponse>("/UpdateUser", data);

  public GetMarketAppList = async () =>
    this.instance.get<
      ApiDecorator<ApiResponse, "MarketAppList", IMarketAppList[]>
    >("/GetMarketAppList");
  public GetMarketAppListShort = async () =>
    this.instance.get<
      ApiDecorator<ApiResponse, "AppList", IShortMarketAppList[]>
    >("GetAppList");

  public DeactivateApp = async (AppID: number) =>
    this.instance.post<ApiResponse>("/DeactivateApp", {
      AppID,
    });

  public ActivateApp = async (AppID: number) =>
    this.instance.post<ApiResponse>("/ActivateApp", {
      AppID,
    });

  public GetAppLicenses = async (AppType: number) =>
    this.instance.get<ApiDecorator<ApiResponse, "LicenseList", ILicenses[]>>(
      "/GetAppLicensesList",
      {
        params: {
          AppType,
        },
      }
    );

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
    this.instance.post<ApiDecorator<ApiResponse, "ApiKey", string>>(
      "/GenerateApiKey",
      {
        AppID,
      }
    );

  public GenerateRsaKey = async (AppID: number) =>
    this.instance.post<IRsaKeys>("/GenerateRsaKey", {
      AppID,
    });
  public UpdateRsaKey = async (AppID: number, Key: string, KeyType: number) =>
    this.instance.post<IRsaKeys>("/UpdateRsaKey", {
      AppID,
      Key,
      KeyType,
    });

  public DeleteApiKey = async (AppID: number) =>
    this.instance.post<IRsaKeys>("/DeleteApiKey", {
      AppID,
    });

  public GenerateLicenseActivationCode = async (AppID: number) =>
    this.instance.post<ApiDecorator<ApiResponse, "ActivationCode", number>>(
      "/GenerateLicenseActivationCode",
      {
        AppID,
      }
    );

  public GetUserList = async () =>
    this.instance.get<ApiDecorator<ApiResponse, "Users", IUsers[]>>(
      "/GetUsersInfo"
    );

  public GetCompanyInfo = async () =>
    this.instance.get<ApiDecorator<ApiResponse, "Company", ICompanyData>>(
      "/GetCompanyInfo"
    );

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
    this.instance.get<ApiDecorator<ApiResponse, "NewsList", INewsList[]>>(
      "/GetAppNews",
      {
        params: {
          AppType,
        },
      }
    );

  public UpdateNews = async (NewsData: INewsList) =>
    this.instance.post<ApiResponse>("/UpdateAppNews", {
      NewsData,
    });

  public UpdateApp = async (AppData: IUpdateAppRequest) =>
    this.instance.post<ApiResponse>("/UpdateApp", {
      ...AppData,
    });

  public GetPortalNews = async (ProductType: number) =>
    this.instance.get<ApiDecorator<ApiResponse, "NewsList", INewsList[]>>(
      "/GetPortalNews",
      {
        params: {
          ProductType,
        },
      }
    );

  public SMS_GetCampaign = async () =>
    this.instance.get<
      ApiDecorator<ApiResponse, "CampaignList", ICampaignList[]>
    >("/SMS/SMSGetCampaign");

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
