import HttpClient from "../HttpClient";
import { API_AUTH_URL } from "../../configs/AppConfig";
import {
  IActivateUserRequest,
  IAuthorizeUserRequest,
  IChangePasswordRequest,
  IRegisterCompanyRequest,
  IRegisterUserRequest,
} from "../types.request";
import {
  ApiResponse,
  IAuthorizeUserResponse,
  IGetManagedTokenResponse,
} from "../types.response";
const publicIp = require("react-public-ip");
