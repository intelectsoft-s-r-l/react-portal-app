import { ApiResponse, ApiResponseBase } from "../types.response";
export type DiscountGetInfo = ApiResponseBase<ApiResponse, "Cashback", number> &
  ApiResponseBase<ApiResponse, "Validation", number>;
