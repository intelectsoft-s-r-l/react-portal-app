import HttpService from "../";
import { API_SMS_URL } from "../../configs/AppConfig";
import { ApiDecorator, ApiResponse } from "../types";
import {
  ISmsInfo,
  ISmsInfoPeriod,
  ISmsDetailPeriod,
  ICampaignConfirmation,
  ICampaignList,
} from "./types";

export class SmsService extends HttpService {
  public constructor() {
    super(API_SMS_URL);
  }

  public CheckApiKey = async (APIKey: number) =>
    this.instance.get<ApiResponse>("/CheckApiKey", {
      params: {
        APIKey,
      },
    });

  public GetInfo = async () => this.instance.get<ISmsInfo>("/GetInfo");

  public Info_GetByPeriod = async (
    APIKey: string,
    DateTicksStart: number,
    DateTicksEnd: number
  ) =>
    this.instance.get<ISmsInfoPeriod>("/Info/GetByPeriod", {
      params: {
        APIKey,
        DateTicksStart,
        DateTicksEnd,
      },
    });

  public Info_GetDetailByPeriod = async (
    APIKey: string,
    DateStart: string,
    DateEnd: string
  ) =>
    this.instance.get<ISmsDetailPeriod>("/Info/GetDetailByPeriod", {
      params: {
        APIKey,
        DateStart,
        DateEnd,
      },
    });

  public Info_GetTotal = async (APIKey: string) =>
    this.instance.get<ISmsInfo>("info/GetTotal", {
      params: {
        APIKey,
      },
    });

  public SMS_GetCampaign = async () =>
    this.instance.get<
      ApiDecorator<ApiResponse, "CampaignList", ICampaignList[]>
    >("/Campaign/GetList");

  public SMS_DeleteCampaign = async (ID: number) =>
    this.instance.get<ApiResponse>("/Campaign/Delete", {
      params: {
        ID,
      },
    });

  public SMS_ReviewerUpdate = async (reviewerInfo: ICampaignConfirmation) =>
    this.instance.post<ApiResponse>("/Campaign/Confirmation", {
      ...reviewerInfo,
    });

  public SMS_UpdateCampaign = async (campaignInfo: ICampaignList) =>
    this.instance.post<ApiResponse>("/Campaign/Update", {
      ...campaignInfo,
    });
}
