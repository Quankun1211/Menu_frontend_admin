import type { BackendResponse } from "../../../libs/shared/types/backend-response";
import api from "../../../services/axios";
import type { LoginResponse, RegisterResponse } from "../types/api-response";
import type { logInRequest, RegisterRequest } from "../types/api-request";
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

export const onRegisterApi = async(
    payload: RegisterRequest
) : Promise<BackendResponse<RegisterResponse>> => {
    console.log(payload)
    const {email, name, password, username, confirm_password: confirmPassword} = payload
    const data = await api.post("/auth/register", {
        email,
        name, 
        password,
        username,
        confirmPassword
    })
    return data.data
}