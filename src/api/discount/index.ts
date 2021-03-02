import { AxiosRequestConfig } from "axios";
import HttpService from "../";
import { API_DISCOUNT_URL } from "../../configs/AppConfig";
import { DiscountGetInfo } from "./types";

export class DiscountService extends HttpService {
  public constructor() {
    super(API_DISCOUNT_URL);
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
  public GetInfo = async (APIKey: string, DateStart: string, DateEnd: string) =>
    this.instance.get<DiscountGetInfo>("/GetInfo", {
      params: {
        APIKey,
        DateStart,
        DateEnd,
      },
    });
}
