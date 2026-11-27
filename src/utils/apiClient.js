import axios from "axios";
import { getToken } from "./token";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();

  // Registration and login are public APIs.
  const isPublicApi =
    config.url === "/users/register" ||
    config.url === "/users/login";

  if (token && !isPublicApi) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;