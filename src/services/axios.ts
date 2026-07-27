import axios from "axios";
import { ApiUrls } from "../config/url";

const api = axios.create({
  baseURL: ApiUrls.apiBaseUrl,
  withCredentials: true,
});

api.defaults.headers.post["Content-Type"] = "application/json";

let csrfToken: string | undefined;
let csrfRequest: Promise<string | undefined> | undefined;

const readCookie = (name: string) =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

const loadCsrfToken = async (forceRefresh = false) => {
  const cookieToken = readCookie("csrf_token");
  if (cookieToken) csrfToken = decodeURIComponent(cookieToken);
  if (forceRefresh) csrfToken = undefined;
  if (csrfToken) return csrfToken;
  if (!csrfRequest) {
    csrfRequest = axios
      .get(`${ApiUrls.apiBaseUrl}/auth/csrf`, { withCredentials: true })
      .then((response) => response.data?.data?.csrfToken as string | undefined)
      .finally(() => {
        csrfRequest = undefined;
      });
  }
  csrfToken = await csrfRequest;
  return csrfToken;
};

api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toLowerCase();
  const isSafe = ["get", "head", "options"].includes(method);
  const isPublicAuthMutation = [
    "/auth/login",
    "/auth/register",
    "/auth/verify-otp",
    "/auth/resend-otp",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/refresh",
  ].some((path) => config.url?.includes(path));

  if (!isSafe && !isPublicAuthMutation) {
    const token = await loadCsrfToken();
    if (token) config.headers["X-CSRF-Token"] = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const returnedToken = response.data?.data?.csrfToken;
    if (returnedToken) csrfToken = returnedToken;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isCsrfError =
      error.response?.status === 403 &&
      error.response?.data?.message?.includes("CSRF");

    if (isCsrfError && originalRequest && !originalRequest._csrfRetry) {
      originalRequest._csrfRetry = true;
      const token = await loadCsrfToken(true);
      if (token) originalRequest.headers["X-CSRF-Token"] = token;
      return api(originalRequest);
    }

    const isAuthRoute = ["/auth/login", "/auth/logout", "/auth/register", "/auth/refresh"]
      .some((path) => originalRequest?.url?.includes(path));

    if (error.response?.status === 401 && !isAuthRoute && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${ApiUrls.apiBaseUrl}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        csrfToken = response.data?.data?.csrfToken || csrfToken;
        return api(originalRequest);
      } catch (refreshError: any) {
        if (window.location.pathname !== "/account/login") {
          window.location.href = "/account/login";
        }
        return Promise.reject(refreshError.response?.data || refreshError);
      }
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default api;
