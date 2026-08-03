import axios from "axios";
import { ApiUrls } from "../config/url";
import { clearTokens, getRefreshToken, getToken, setRefreshToken, setToken } from "../utils/token";
import { useAppStore } from "../store/app.store";
import { message } from "antd";
import { getFriendlyError } from "../utils/friendlyError";

const api = axios.create({
  baseURL: ApiUrls.apiBaseUrl,
  withCredentials: true,
});

api.defaults.headers.post["Content-Type"] = "application/json";

let csrfToken: string | undefined;
let csrfRequest: Promise<string | undefined> | undefined;
let refreshRequest: Promise<any> | undefined;
let lastErrorToast = { text: "", at: 0 };
const showErrorToast = (text: string) => {
  const now = Date.now();
  if (lastErrorToast.text === text && now - lastErrorToast.at < 3000) return;
  lastErrorToast = { text, at: now };
  message.error(text);
};

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
      .get(`${ApiUrls.apiBaseUrl}/auth/csrf-tokens`, { withCredentials: true })
      .then((response) => response.data?.data?.csrfToken as string | undefined)
      .finally(() => {
        csrfRequest = undefined;
      });
  }
  csrfToken = await csrfRequest;
  return csrfToken;
};

api.interceptors.request.use(async (config) => {
  const accessToken = getToken();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  const method = (config.method || "get").toLowerCase();
  const isSafe = ["get", "head", "options"].includes(method);
  const isPublicAuthMutation = [
    "/auth/sessions",
    "/auth/registrations",
    "/auth/email-verifications",
    "/auth/email-verification-deliveries",
    "/auth/password-reset-requests",
    "/auth/password-resets",
    "/auth/session-refreshes",
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

    const requestUrl = originalRequest?.url || "";
    const isAuthRoute = ["auth/sessions", "auth/registrations", "auth/session-refreshes"]
      .some((path) => requestUrl.includes(path));

    if (error.response?.status === 401 && !isAuthRoute && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        refreshRequest ||= axios
          .post(
            `${ApiUrls.apiBaseUrl}/auth/session-refreshes`,
            { token: getRefreshToken(), clientType: "spa" },
            { withCredentials: true },
          )
          .finally(() => {
            refreshRequest = undefined;
          });
        const response = await refreshRequest;
        const nextAccessToken = response.data?.data?.access_token;
        const nextRefreshToken = response.data?.data?.refresh_token;
        if (nextAccessToken) setToken(nextAccessToken);
        if (nextRefreshToken) setRefreshToken(nextRefreshToken);
        csrfToken = response.data?.data?.csrfToken || csrfToken;
        return api(originalRequest);
      } catch (refreshError: any) {
        clearTokens();
        useAppStore.getState().setUserData(null);
        message.info("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.");
        if (window.location.pathname !== "/account/login") {
          window.location.href = "/account/login";
        }
        return Promise.reject(refreshError.response?.data || refreshError);
      }
    }
    const friendlyMessage = getFriendlyError(error);
    showErrorToast(friendlyMessage);
    return Promise.reject({ ...(error.response?.data || {}), message: friendlyMessage, statusCode: error.response?.status });
  },
);

export default api;
