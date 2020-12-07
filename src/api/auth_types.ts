export interface IAuthorizerUser {
    Email: string;
    Password?: string;
    info: string;
}
export interface IRegisterCompany {
    IDNO: string;
    JuridicalName: string;
    UiLanguage?: number;
    UsrEmail: string;
    UsrPassword: string;
    VATCode: string;
}
export interface IRegisterUser {
    Email: string;
    FirstName: string;
    LastName: string;
    CompanyID?: number;
    Token?: string;
    UiLanguage?: number;
}

export interface IResetPassword extends IAuthorizerUser {}

export interface IChangePassword {
    NewPassword: string;
    OldPassword: string;
    Token?: string;
}
