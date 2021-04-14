import { ApiResponse, ApiRequest } from "../types";

export interface ISmsInfo extends ApiResponse {
  FailedDelivery: number;
  IncomeThisMonth: number;
  IncomeThisWeek: number;
  IncomeToday: number;
  Rejected: number;
  SentThisMonth: number;
  SentThisWeek: number;
  SentToday: number;
  WaitingForSend: number;
}

export interface ISmsInfoPeriod extends ApiResponse {
  Created: number;
  Delivery: number;
  FailedOrRejected: number;
  Pending: number;
}
export interface ISmsList {
  Created: string;
  Message: string;
  MessageType: number | string;
  Phone: string;
  SentDate: string;
  State: number;
}

export interface ISmsDetailPeriod extends ApiResponse {
  SMSList: ISmsList[];
  TotalSMS: number;
}
export interface ICampaignList extends ApiRequest {
  Category?: number;
  CompanyName?: string;
  CreateDate?: any;
  Description?: string;
  ID?: number;
  Message?: string;
  Name: string;
  PhoneList?: string;
  ReviewedByUser?: string;
  ReviewerComments?: string;
  ScheduledDate?: any;
  Status?: number;
}
export interface ICampaignConfirmation extends ApiRequest {
  ID: number;
  ReviewerComments: string;
  Status?: number;
}
