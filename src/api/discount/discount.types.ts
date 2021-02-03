import { ApiResponse, ApiResponseBase } from "../types";
export type DiscountGetInfo = ApiResponseBase<ApiResponse, "Cashback", number> &
  ApiResponseBase<ApiResponse, "Validation", number>;
