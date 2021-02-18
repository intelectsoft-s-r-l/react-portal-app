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
