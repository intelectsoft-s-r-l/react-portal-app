import { AxiosRequestConfig } from "axios";
import HttpService from "../";
import { API_BILL_URL } from "../../configs/AppConfig";
import { IGetBillInfo } from "./types";

export class BillService extends HttpService {
  public constructor() {
    super(API_BILL_URL);
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
  public GetBillInfo = async (ID: string, DID: string) =>
    this.instance.get<IGetBillInfo>("/GetBillInfo", {
      params: {
        ID,
        DID,
      },
    });
}
