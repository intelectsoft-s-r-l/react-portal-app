import { ApiDecorator, ApiResponse } from "../types";

export interface IBill {
  Address: string;
  BillItems: IBillItems[];
  Client: string;
  Date: any;
  Discount: number;
  FiscalNumber: string;
  FreeTextFooter: string;
  FreeTextHeader: string;
  ID: string;
  IDNO: string;
  Number: string;
  OperationType: number;
  OperatorCode: string;
  PaymantCode: number;
  PaymantType: string;
  ShiftNumber: string;
  Summ: number;
  TotalArticle: number;
  User: string;
  Workplace: string;
}
export interface IBillItems {
  BasePrice: number;
  CPVCod: string;
  Discount: number;
  FinalPrice: number;
  Name: string;
  Quantity: number;
  Summ: number;
  VATCode: "A" | "B" | "C";
  VATTotal: number;
  VATValue: number;
}
export type IGetBillInfo = ApiDecorator<ApiResponse, "Bill", IBill> &
  ApiDecorator<ApiResponse, "Company", string>;
