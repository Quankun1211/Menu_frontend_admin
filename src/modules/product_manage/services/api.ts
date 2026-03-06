import type { BackendResponse } from "../../../libs/shared/types/backend-response";
import api from "../../../services/axios";
import type { PaginationResponse } from "../../../types/api-response";
import type { ProductAddRequest } from "../types/api-request";
import type { ProductResponse, SaleResponse } from "../types/api-response";

export const getAllProductAdminApi = async (
    params: { page: number; limit: number; status?: string, search ?: string }
): Promise<PaginationResponse<ProductResponse>> => {
    const { page, limit, status, search } = params;
    const response = await api.get("/admin/get-all-products", {
        params: {
            page,
            limit,
            status: status === "all" ? undefined : status,
            search: search || undefined
        }
    });
    return response.data;
};

export const getAllSpecialAdminApi = async (
    params: { page: number; limit: number; status?: string }
): Promise<PaginationResponse<ProductResponse>> => {
    const { page, limit, status } = params;
    const response = await api.get("/admin/get-all-specials", {
        params: {
            page,
            limit,
            status: status === "all" ? undefined : status,
        }
    });
    return response.data;
};

export const getAllAvailableSalesApi = async() : Promise<BackendResponse<SaleResponse[]>> => {
    const data = await api.get("/admin/get-all-sales")
    return data.data
}

export const createProductAdminApi = async (
    formData: FormData
): Promise<BackendResponse<ProductAddRequest>> => {
    const response = await api.post("/admin/create-product", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateProductAdminApi = async (id: string, formData: FormData) => {
  const response = await api.put(`/admin/product-update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getProductDetailApi = async (id: string) => {
    const response = await api.get(`/admin/get-product-detail/${id}`);
    return response.data;
};

export const deleteProductApi = async (id: string) => {
    const response = await api.delete(`/admin/product-delete/${id}`);
    return response.data;
};