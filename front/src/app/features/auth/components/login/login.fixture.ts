import { SessionInformation } from "src/app/interfaces/sessionInformation.interface";
import { LoginRequest } from "../../interfaces/loginRequest.interface";

export const EMPTY_STRING = '';

export const INVALID_FORM_VALUES = {
  EMAIL: "invalidmail",
  PASSWORD: "xx"
}

export const VALID_FORM_VALUES = {
  email: "validmail@gmail.com",
  password: "valid"
}

export const ADMIN_SESSION_INFO_FIXTURE: SessionInformation =  {
    id: 1,
    token: "abc",
    type: "Bearer",
    username: "le boss",
    firstName: "zak",
    lastName: "lahm",
    admin: true
} 

export const VALID_LOGIN_REQUEST_FIXTURE: LoginRequest = {
  email: "validmail@gmail.com",
  password: "valid"
};


export const INVALID_LOGIN_REQUEST_FIXTURE: LoginRequest = {
  email: "invalidmail",
  password: "xx"
}