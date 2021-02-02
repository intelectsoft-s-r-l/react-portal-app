import HttpClient from "../HttpClient";
import { API_DISCOUNT_URL } from "../../configs/AppConfig";
import { DiscountGetInfo } from "./discount.types";

export class DiscountService extends HttpClient {
  public constructor() {
    super(API_DISCOUNT_URL);
  }
  public GetInfo = async (APIKey: string, DateStart: string, DateEnd: string) =>
    this.instance.get<DiscountGetInfo>("/GetInfo", {
      params: {
        APIKey,
        DateStart,
        DateEnd,
      },
    });
}
