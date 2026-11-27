// Replace these paths with the actual backend mappings.
// Paths are relative to the /api base URL.

export const AUTH_PATHS = {
    register: "/REPLACE_WITH_REGISTER_PATH",
    login: "/REPLACE_WITH_LOGIN_PATH"
  };
  
  // These field names must match the backend request DTO.
  // Change the right-hand values if the Java DTO uses
  // different names, such as fullName or userName.
  export const REGISTER_FIELDS = {
    name: "name",
    email: "email",
    password: "password"
  };
  
  export const LOGIN_FIELDS = {
    email: "email",
    password: "password"
  };
  
  // Adjust this if the real backend response is different.
  export function getLoginToken(data) {
    return data?.token ?? null;
  }