import { ApiRequest } from "../types";

export interface IRegisterUserRequest extends ApiRequest {
  CompanyID: number;
  Email: string;
  FirstName: string;
  LastName: string;
  UiLanguage?: number;
}

export interface IRegisterCompanyRequest {
  IDNO: number;
  JuridicalName: string;
  UiLanguage: number;
  UsrEmail: string;
  UsrPassword: string;
  VATCode?: string;
}
