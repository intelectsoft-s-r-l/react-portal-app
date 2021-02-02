export interface ApiResponse {
  ErrorCode: number;
  ErrorMessage: string;
}

export type ApiResponseBase<
  Obj,
  Key extends string | number | symbol,
  Value
> = Obj &
  {
    [prop in Key]: Value;
  };

/* Status handlers */

/* Users */
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
  UiLanguage: number;
}
export interface IGetAllUsersInfoResponse extends ApiResponse {
  Users: IUsers[];
}

/* Company */
export interface IGetBasicCompaniesListResponse extends ApiResponse {
  CompanyList: {
    ID: number;
    Logo?: string;
    Name: string;
    Status?: string;
  }[];
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
export interface IGetCompanyInfoResponse extends ApiResponse {
  Company: ICompanyData;
}

export interface IGetCompanyListResponse extends ApiResponse {
  CompanyList: ICompanyData[];
}

/* Apps */
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

export interface IMarketAppListShort {
  AppType: number;
  ID: number;
  Name: string;
  Photo: string;
  ShortDescription?: string;
}
export interface ILocale {
  en: string;
  ro: string;
  ru: string;
}
export interface IGetMarketAppListResponse extends ApiResponse {
  MarketAppList: IMarketAppList[];
}

export interface IGetMarketAppListShortResponse extends ApiResponse {
  AppList: IMarketAppListShort[];
}

/* News */
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
export interface IGetNewsResponse extends ApiResponse {
  NewsList: INewsList[];
}

/* Profile */
export interface IGetProfileInfoResponse extends ApiResponse {
  User: {
    Company?: string;
    CompanyID?: number;
    CreateDate?: string;
    Email: string;
    FirstName: string;
    ID: string;
    LastAuthorize?: string;
    LastAuthorizeIP?: string;
    LastName: string;
    PhoneNumber: string;
    Photo: string;
    Status: number;
    UiLanguage: number;
  };
}

/* Register/Update company */
export interface IRegisterClientCompanyResponse extends ApiResponse {
  CompanyID: number;
}

export interface IRefreshTokenResponse extends ApiResponse {
  Token: string;
}

export interface IAuthorizeUserResponse extends ApiResponse {
  Token: string;
}

export interface ISendActivationCodeResponse extends ApiResponse {}

export interface IResetPasswordResponse extends ApiResponse {}

export interface IRegisterUserResponse extends ApiResponse {}

export interface IGetManagedTokenResponse extends ApiResponse {
  Token: string;
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
  WiFi: {};
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
export interface IGetAppLicensesListResponse extends ApiResponse {
  LicenseList: ILicenses[];
}

export interface IGenerateApiKeyResponse extends ApiResponse {
  ApiKey: string;
}

export interface IGenerateLicenseActivationCodeResponse extends ApiResponse {
  ActivationCode: number;
}
export interface IGenerateRsaKeyResponse extends ApiResponse {
  EncryptionPublicKey: string;
  EncryptionPrivateKey: string;
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
export interface ISMSGetCampaignResponse extends ApiResponse {
  CampaignList: ICampaignList[];
}
