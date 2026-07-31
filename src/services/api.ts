import type { BackendResponse } from "../libs/shared/types/backend-response";
import type { UserRecord } from "../types/api-response";
import api from "./axios";
import { getRefreshToken } from "../utils/token";

export const onGetMeApi = async (): Promise<BackendResponse<UserRecord>> => {
    const data = await api.get("/users/me")
    return data.data
}

export const onLogoutApi = async (): Promise<BackendResponse<{message: string}>> => {
    const data = await api.delete("/auth/sessions", { data: { token: getRefreshToken() } })
    return data.data
}
