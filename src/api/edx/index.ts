import { AxiosRequestConfig } from "axios";
import HttpService from "../";
import { API_EDX_URL } from "../../configs/AppConfig";
import { ApiResponse, ApiDecorator } from "../types";
import { InvoiceList, IOrderList } from "./types";

export class EdxService extends HttpService {
  public constructor() {
    super(API_EDX_URL);
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

  public CheckApiKey = async (APIKey: string) =>
    this.instance.get<ApiResponse>("/CheckApiKey", {
      params: { APIKey },
    });

  public GetInvoice = async (APIKey: string, DStart: any, DEnd: any) =>
    this.instance.get<ApiDecorator<ApiResponse, "InvoiceList", InvoiceList[]>>(
      "/GetInInvoices",
      {
        params: { APIKey, DStart, DEnd },
      }
    );
  public GetSentInvoice = async (APIKey: string, DStart: any, DEnd: any) =>
    this.instance.get<ApiDecorator<ApiResponse, "InvoiceList", InvoiceList[]>>(
      "/GetUploadInvoice",
      {
        params: { APIKey, DStart, DEnd },
      }
    );

  public GetOrder = async (APIKey: string, DStart: any, DEnd: any) =>
    this.instance.get<ApiDecorator<ApiResponse, "OrderList", IOrderList[]>>(
      "/GetInOrders",
      {
        params: { APIKey, DStart, DEnd },
      }
    );

  public GetSentOrder = async (APIKey: string, DStart: any, DEnd: any) =>
    this.instance.get<ApiDecorator<ApiResponse, "OrderList", IOrderList[]>>(
      "/GetUploadOrder",
      {
        params: { APIKey, DStart, DEnd },
      }
    );
}
