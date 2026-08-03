import { ERROR_TEXT } from "../config/errorText";
export function getFriendlyError(error: any) {
  const data = error?.response?.data || error || {};
  const status = error?.response?.status || data.statusCode;
  const code = data.code || error?.code;
  if (!error?.response && ["ERR_NETWORK", "ECONNABORTED", "ETIMEDOUT"].includes(error?.code)) return ERROR_TEXT.NETWORK_ERROR;
  if (code && ERROR_TEXT[code]) return ERROR_TEXT[code];
  if (status === 400) return data.message || data.error || ERROR_TEXT.BAD_REQUEST;
  if (status === 401) return data.message || data.error || ERROR_TEXT.LOGIN_REQUIRED;
  if (status === 403) return ERROR_TEXT.PERMISSION_DENIED;
  if (status === 404) return ERROR_TEXT.NOT_FOUND;
  if (status === 409) return data.message || ERROR_TEXT.CONFLICT;
  if (status === 422) return data.message || ERROR_TEXT.VALIDATION_ERROR;
  if (status === 429) return ERROR_TEXT.TOO_MANY_REQUESTS;
  if (status >= 500) return ERROR_TEXT.SERVER_ERROR;
  return data.message || data.error || ERROR_TEXT.UNKNOWN_ERROR;
}
