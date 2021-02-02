import HttpClient from "../HttpClient";
import { API_EDX_URL } from "../../configs/AppConfig";
import { ApiResponse, ApiResponseBase } from "../types.response";
import { InvoiceList, IOrderList } from "./edx.types";

export class EdxService extends HttpClient {
  public constructor() {
    super(API_EDX_URL);
  }

  public CheckApiKey = async (APIKey: string) =>
    this.instance.get<ApiResponse>("/CheckApiKey", {
      params: { APIKey },
    });

  public GetInvoice = async (APIKey: string, DStart: any, DEnd: any) =>
    this.instance.get<
      ApiResponseBase<ApiResponse, "InvoiceList", InvoiceList[]>
    >("/GetInInvoices", {
      params: { APIKey, DStart, DEnd },
    });

  public GetOrder = async (APIKey: string, DStart: any, DEnd: any) =>
    this.instance.get<ApiResponseBase<ApiResponse, "OrderList", IOrderList[]>>(
      "/GetInOrders",
      {
        params: { APIKey, DStart, DEnd },
      }
    );
}
