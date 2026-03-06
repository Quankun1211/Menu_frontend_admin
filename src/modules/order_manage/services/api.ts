import type { BackendResponse } from "../../../libs/shared/types/backend-response";
import api from "../../../services/axios";
import type { PaginationResponse } from "../../../types/api-response";
import type { UserResponse } from "../../account_manage/types/api-response";
import type { AssignOrderRequest, CancelProcessRequest } from "../types/api-request";
import type { OrderResponse } from "../types/api-response";

export const getAllOrderAdminApi = async (
    params: { page: number; limit: number; status?: string }
): Promise<PaginationResponse<OrderResponse>> => {
    const { page, limit, status } = params;
    const response = await api.get("/admin/get-all-orders", {
        params: {
            page,
            limit,
            status: status === "all" ? undefined : status,
        }
    });
    return response.data;
};

export const onAssignOrderApi = async(
    payload: AssignOrderRequest
) : Promise<BackendResponse<UserResponse>> => {
    const { orderId, shipperId } = payload
    const data = await api.post("/admin/assign-order", {
        orderId,
        shipperId
    })
    return data.data
}

export const onProcessCancelApi = async ( payload: CancelProcessRequest) => {
    const { data } = await api.patch(`/admin/process-cancel`, payload);
    return data;
};