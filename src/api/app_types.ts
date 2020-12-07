export interface AppInterface {
    AppID: number;
    Token?: string;
    BackOfficeURI?: string;
}
export interface INewsData {
    AppType: number;
    CompanyID: number;
    CompanyName?: string;
    Content?: string;
    CreateDate?: string;
    Header?: String;
    ID?: number;
    Photo?: string;
}
export interface INews {
    NewsData: INewsData;
    Token?: string;
}
export interface IUser {
    Email?: string;
    FirstName?: string;
    ID: number;
    LastName?: string;
    PhoneNumber?: string;
    Photo?: string;
    Status?: number;
    UiLanguage?: number;
}
export interface IUpdateUser {
    Token?: string;
    User: IUser;
}

export interface ICompany {
    BIC?: string;
    Bank?: string;
    CommercialName?: string;
    CountryID?: number;
    CreateDate?: string;
    Email?: string;
    IBAN?: string;
    ID?: number;
    IDNO?: string;
    IsVATPayer?: boolean;
    JuridicalAddress?: string;
    JuridicalName?: string;
    Logo?: string;
    OfficeAddress?: string;
    PhoneNumber?: string;
    PostalCode?: string;
    ShortName?: string;
    Status?: number;
    VATCode?: string;
    WebSite?: string;
}

export interface IUpdateCompany {
    Company: ICompany;
    Token?: string;
    info?: string;
}
