import type { BackendResponse } from "../../../libs/shared/types/backend-response";
import api from "../../../services/axios";
import type { LoginResponse } from "../types/api-response";
import type { logInRequest } from "../types/api-request";
export const onLogInApi = async(
    payload: logInRequest
) : Promise<BackendResponse<LoginResponse>> => {
    const {username, password} = payload
    const data = await api.post("auth/login", {
        username,
        password
    })
    return data.data
}
