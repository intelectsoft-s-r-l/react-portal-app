export interface ApiResponse {
  ErrorCode?: number;
  ErrorMessage?: string;
}

/* Status handlers */
export interface IChangeCompanyStatusResponse extends ApiResponse {}

export interface IChangeMarketAppStatusResponse extends ApiResponse {}

export interface IChangeUserStatusResponse extends ApiResponse {}

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
export interface IUpdateUserResponse extends ApiResponse {}

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
  AppType?: number;
  ApyKey?: string;
  BackOfficeURI?: string;
  ID: number;
  LicenseActivationCode?: number;
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
export interface ILocale {
  en: string;
  ro: string;
  ru: string;
}
export interface IGetMarketAppListResponse extends ApiResponse {
  MarketAppList: IMarketAppList[];
}

export interface IUpdateMarketAppResponse extends ApiResponse {}
export interface IUpdatePackageResponse extends ApiResponse {}

/* News */
export interface INewsList {
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
export interface IUpdateNewsResponse extends ApiResponse {}

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

export interface IUpdateCompanyResponse extends ApiResponse {}

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

export interface IChangePasswordResponse extends ApiResponse {}

export interface IActivateUserResponse extends ApiResponse {}

export interface IDeleteMarketAppPackageResponse extends ApiResponse {}

export interface IDeactivateAppResponse extends ApiResponse {}
export interface IActivateAppResponse extends ApiResponse {}

export interface ILicenses {
  ApplicationVersion: string;
  CreateDate: string;
  DeviceID: string;
  DeviceName: string;
  DiagnosticInfoDate: string;
  DiagnosticInformation: string;
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
export interface IGetAppLicensesList extends ApiResponse {
  LicenseList: ILicenses[];
}

export interface IRequestLicenseResponse extends ApiResponse {}

export interface IReleaseLicenseResponse extends ApiResponse {}

export interface IDeleteAppLicenseResponse extends ApiResponse {}

export interface IGenerateApiKeyResponse extends ApiResponse {
  ApiKey: string;
}

export interface IGenerateLicenseActivationCodeResponse extends ApiResponse {
  AppID: number;
}

export interface ICampaignList {
  Category: number;
  CompanyName: string;
  CreateDate: string;
  Description: string;
  ID: number;
  Message: string;
  Name: string;
  PhoneList: string;
  ReviewedByUser: string;
  ReviewerComments: string;
  ScheduleDate: string;
  Status: number;
}
export interface ISMSGetCampaignResponse extends ApiResponse {
  CampaignList: ICampaignList[];
}

export interface ISMSDeleteCampaignResponse extends ApiResponse {}

export interface ISMSReviewerUpdateResponse extends ApiResponse {}

export interface ISMSUpdateCampaignResponse extends ApiResponse {}
