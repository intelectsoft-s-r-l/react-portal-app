import { ApiResponse } from "../types.response";

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
  MessageType: number;
  Phone: string;
  SentDate: string;
  State: number;
}

export interface ISmsDetailPeriod extends ApiResponse {
  SMSList: ISmsList[];
  TotalSMS: number;
}
