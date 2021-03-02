import HttpService from "../..";
import { API_APP_URL } from "../../../configs/AppConfig";
import { ApiResponse } from "../../types";
import { IGenerateDatabase } from "./types";

class ManagementService extends HttpService {
  constructor() {
    super(`${API_APP_URL}/ManagementDB`);
  }

  private GenerateDatabase = (data: IGenerateDatabase) =>
    this.instance.post<ApiResponse>(`/GenerateDatabase`, data);
}
