import { ApiRequest, ApiResponse } from "../types";

export interface IUsers {
  Company: string;
  CompanyID: number;
  Email: string;
  FirstName: string;
  LastName: string;
  ID: number;
  LastAuthorize: string;
  LastAuthorizeIP: string;
  PhoneNumber: string;
  Photo: string;
  Status: number;
  UiLanguage: number | string;
}

export interface IBasicCompanyList {
  ID: number;
  Logo?: string;
  Name: string;
  Status: string;
}

export interface ICompanyData {
  BIC?: string;
  Bank?: string;
  Email?: string;
  CommercialName?: string;
  CountryID?: number;
  ID?: number;
  IBAN?: string;
  IDNO?: string;
  IsVATPayer?: boolean;
  JuridicalAddress?: string;
  JuridicalName?: string;
  Logo?: string;
  OfficeAddress?: string;
  PostalCode?: string;
  ShortName?: string;
  Status?: number;
  VATCode?: number;
  WebSite?: string;
}
export interface IPackages {
  ValidDate?: any;
  Range?: string | number;
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

export interface ILocale {
  en: string;
  ro: string;
  ru: string;
}
export interface IShortMarketAppList {
  AppType: number;
  ID: number;
  Name: string;
  Photo: string;
  ShortDescription?: string;
}
export interface IMarketAppList {
  AppType: number;
  ApyKey: string;
  BackOfficeURI?: string;
  ID: number;
  LicenseActivationCode?: number;
  EncryptionPrivateKey: string;
  EncryptionPublicKey: string;
  ModuleSettings: {
    APIKey: boolean;
    ActivationCode: boolean;
    Backoffice: boolean;
    License: boolean;
    ProductType: number;
    RSAKey: boolean;
  };
  LicenseActivationCodeValidHours?: number;
  LicenseActivationCodeValidTo?: string;
  LongDescription: ILocale | string;
  Name: string;
  Packages?: IPackages[];
  Photo: string;
  ShortDescription: ILocale | string;
  Status?: number;
  TermsOfUse: ILocale | string;
  ExternalSecurityPolicy: any;
}

export interface INewsList {
  CompanyName?: string;
  CompanyID?: number;
  AppType?: number;
  Content: string;
  CreateDate?: any;
  Header: string;
  ID: number;
  Photo: string;
  ProductType?: number;
  Status?: number;
}

export interface ILicenses {
  ApplicationVersion: string;
  CreateDate: string;
  DeviceID: string;
  DeviceName: string;
  DiagnosticInfoDate: string;
  DiagnosticInformation: string | IDiagnosticInformation;
  ID: string;
  LastAccessDate: string;
  LicenseActivationDate: string;
  LicenseCode: string;
  OSType: number;
  OSVersion: string;
  PrivateIP: string;
  ProductType: number;
  PublicIP: string;
  SalePointAddress: string;
  SerialNumber: string;
  Status: number;
  Workplace: string;
}
export interface IDiagnosticInformation {
  Battery: {
    Level: number;
    Voltage: number;
    Plugged: number;
    Status: number;
    Health: number;
    Temperature: number;
    Technology: string;
  };
  Memory: {
    Installed: string;
    Free: string;
    Used: string;
  };
  CPU: {};
  WiFi?: {
    Connected?: boolean;
    SSID?: string;
  };
  Date?: string;
}

export interface ICampaignList {
  Category: number;
  CompanyName: string;
  CreateDate: any;
  Description: string;
  ID: number;
  Message: string;
  Name: string;
  PhoneList?: string;
  ReviewedByUser: string;
  ReviewerComments: string;
  ScheduledDate: any;
  Status: number;
}

export interface IRsaKeys extends ApiResponse {
  EncryptionPublicKey: string;
  EncryptionPrivateKey: string;
}

export interface ICreateAppPackage extends ApiRequest {
  AppPackage: IPackages;
  MarketAppID: number;
}
export interface ISMSReviewerUpdateRequest extends ApiRequest {
  ID: number;
  ReviewerComments: string;
  Status?: number;
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
export interface IUpdateAppRequest extends ApiRequest {
  AppID: number;
  BackOfficeURI: string;
  ExternalSecurityPolicy?: any;
}
