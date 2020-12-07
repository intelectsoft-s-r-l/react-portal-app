export interface IPackages {
    ID: number;
    MaxValue: number;
    MinValue: number;
    Name: string;
    Price: number;
    Status: number;
    ValidFrom: string;
    ValidTo: string;
}
export interface IMarketAppList {
    AppType: number;
    ApyKey: string;
    MarketID: number;
    ApplicationID: number;
    LicenseActivationCode: number;
    LicenseActivationCodeValidHours: number;
    LicenseActivationCodeValidTo: string;
    LongDescription: string;
    Name: string;
    Packages: IPackages[];
    Photo: string;
    ShortDescription: string;
    Status: number;
}
export interface IApplications {
    ErrorCode: number;
    ErrorMessage: string;
    MarketAppList: IMarketAppList[];
}

export interface ITextEditor {
    [key: string]: string;
}
