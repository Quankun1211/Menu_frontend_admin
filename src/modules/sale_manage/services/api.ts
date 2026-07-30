import type { BackendResponse } from "../../../libs/shared/types/backend-response"
import api from "../../../services/axios"
import type { SaleRequest } from "../types/api-request"
import type { SaleResponse } from "../types/api-response"

export const getAllSalesApi = async() : Promise<BackendResponse<SaleResponse[]>> => {
    const data = await api.get("/admin/sales")
    return data.data
}

export const createSaleApi = async (data: SaleRequest): Promise<BackendResponse<SaleResponse>> => {
    const response = await api.post("/admin/sales", data);
    return response.data;
};

export const updateSaleApi = async ({ id, data }: { id: string; data: SaleRequest }): Promise<BackendResponse<SaleResponse>> => {
    const response = await api.put(`/admin/sales/${id}`, data);
    return response.data;
};

export const deleteSaleApi = async (id: string): Promise<BackendResponse<any>> => {
    const response = await api.delete(`/admin/sales/${id}`);
    return response.data;
};