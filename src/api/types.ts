export interface ApiResponse {
  ErrorCode: number;
  ErrorMessage: string;
}

export interface ApiRequest {
  Token?: string;
}

export type ApiDecorator<
  Obj,
  Key extends string | number | symbol,
  Value
> = Obj &
  {
    [prop in Key]: Value;
  };

// Auth
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
