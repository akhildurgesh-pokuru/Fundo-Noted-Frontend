import axios from "axios";
import { getToken } from "./token";

const apiClient = axios.create({
  baseURL: "/api",
});

// APIs that do not require a JWT
const publicPaths = [
  "/users/register",
  "/users/login",
  "/users/verify-email",
  "/users/resend-verification",
  "/users/forgot-password",
  "/users/reset-password"
];

apiClient.interceptors.request.use((config) => {
  const path = config.url?.split("?")[0];

  const isPublicApi = publicPaths.includes(path);

  if (!isPublicApi) {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // IMPORTANT: Always return config
  return config;
});

export default apiClient;