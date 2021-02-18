import { ApiResponse, ApiDecorator } from "../types";
export type DiscountGetInfo = ApiDecorator<ApiResponse, "Cashback", number> &
  ApiDecorator<ApiResponse, "Validation", number>;
