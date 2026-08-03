import type { BackendResponse } from "../../../libs/shared/types/backend-response";
import api from "../../../services/axios";
import type { PaginationResponse } from "../../../types/api-response";
import type { UserRegisterRequest, UserUpdateRequest } from "../types/api-request";
import type { UserResponse } from "../types/api-response";

export const onRegisterUserApi = async(
    payload: UserRegisterRequest
) : Promise<BackendResponse<UserResponse>> => {
    const {email, name, password, phone, username, role} = payload
    const data = await api.post("/admin/users", {
        name, 
        username,
        email,
        phone,
        password,
        role
    })
    return data.data
}
export const getAdminsAndShippersApi = async (
    params: { page: number; limit: number; role?: string; search?: string; availability?: "online" | "all"; orderId?: string }
): Promise<PaginationResponse<UserResponse>> => {
    const { page, limit, role, search, availability, orderId } = params;
    const response = await api.get("/admin/users", {
        params: {
            page,
            limit,
            role: role === "all" ? undefined : role,
            search: search || undefined,
            availability,
            orderId,
        }
    });
    return response.data;
};

export const deleteUserApi = async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
};

export const updateUserApi = async (id: string, payload: UserUpdateRequest) => {
    const { data } = await api.patch(`/admin/users/${id}`, payload);
    return data;
};
