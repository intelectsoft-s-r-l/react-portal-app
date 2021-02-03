import HttpClient from "../HttpClient";
import { API_SMS_URL } from "../../configs/AppConfig";
import { ApiResponse } from "../types";
import { ISmsInfo, ISmsInfoPeriod, ISmsDetailPeriod } from "./sms.types";

export class SmsService extends HttpClient {
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
}
