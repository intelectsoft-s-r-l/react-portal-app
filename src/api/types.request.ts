import { ICompanyData, ILocale, IPackages } from "./types.response";

interface ApiRequest {
  Token?: string;
}

/* Auth */
export interface IAuthorizeUserRequest {
  Email: string;
  Password: string;
  info?: string;
}

export interface IRegisterUserRequest extends ApiRequest {
  CompanyID: number;
  Email: string;
  FirstName: string;
  LastName: string;
  UiLanguage?: number;
}

export interface IChangePasswordRequest extends ApiRequest {
  NewPassword: string;
  OldPassword: string;
}

export interface IAppPackageRequest {
  ID: number;
  MaxValue: number;
  MinValue: number;
  Name: string;
  Price: number;
  SortIndex: number;
  Status: number;
  ValidFrom: string;
  ValidTo: string;
}
export interface ICreateMarketAppPackageRequest extends ApiRequest {
  AppPackage: IAppPackageRequest;
  MarketAppID: number;
}

export interface IRegisterClientCompanyRequest extends ApiRequest {
  Company: ICompanyData;
  info?: string;
}

export interface IUpdateCompanyRequest extends ApiRequest {
  Company: ICompanyData;
  info?: string;
}

export interface IUpdateNewsRequest extends ApiRequest {
  NewsData: {
    Content: string;
    CreateDate?: string;
    Header: string;
    ID: number;
    Photo: string;
    ProductType: number;
    Status?: number;
  };
}

export interface IActivateUserRequest extends ApiRequest {
  Token: string;
}

export interface IRegisterCompanyRequest {
  IDNO: number;
  JuridicalName: string;
  UiLanguage: number;
  UsrEmail: string;
  UsrPassword: string;
  VATCode?: string;
}

export interface IUpdateAppRequest extends ApiRequest {
  AppID: number;
  BackOfficeURI: string;
  ExternalSecurityPolicy?: any;
}

export interface ISMSReviewerUpdateRequest extends ApiRequest {
  ID: number;
  ReviewerComments: string;
  Status?: number;
}
