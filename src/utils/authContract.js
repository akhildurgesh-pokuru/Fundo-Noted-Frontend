export const AUTH_PATHS = {
    register: "/users/register",
    login: "/users/login"
  };
  
  export const REGISTER_FIELDS = {
    firstName: "firstName",
    lastName: "lastName",
    email: "email",
    password: "password"
  };
  
  export const LOGIN_FIELDS = {
    email: "email",
    password: "password"
  };
  
  export function getLoginToken(data) {
    return data?.token ?? null;
  }