import apiClient from "../utils/apiClient";

import {
  AUTH_PATHS,
  REGISTER_FIELDS,
  LOGIN_FIELDS,
  getLoginToken
} from "../utils/authContract";

import { saveToken, removeToken } from "../utils/token";

// Register a new user
export async function registerUser(formData) {
  const requestBody = {
    [REGISTER_FIELDS.name]: formData.name,
    [REGISTER_FIELDS.email]: formData.email,
    [REGISTER_FIELDS.password]: formData.password
  };

  const response = await apiClient.post(
    AUTH_PATHS.register,
    requestBody
  );

  return response.data;
}

// Login using the real backend
export async function loginUser(email, password) {
  const requestBody = {
    [LOGIN_FIELDS.email]: email,
    [LOGIN_FIELDS.password]: password
  };

  const response = await apiClient.post(
    AUTH_PATHS.login,
    requestBody
  );

  const token = getLoginToken(response.data);

  if (typeof token !== "string" || !token.trim()) {
    throw new Error(
      "Login response did not contain the expected JWT. Check authContract.js."
    );
  }

  saveToken(token);

  return response.data;
}

// Clear frontend authentication
export function logoutUser() {
  removeToken();
}