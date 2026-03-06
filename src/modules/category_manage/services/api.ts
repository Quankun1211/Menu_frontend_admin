import type { BackendResponse } from "../../../libs/shared/types/backend-response";
import api from "../../../services/axios";
import type { PaginationResponse } from "../../../types/api-response";
import type { CreateCategoryRequest } from "../types/api-request";
import type { CategoryResponse, CreateCategoryResponse } from "../types/api-response";

export const getAllCategoryAdminApi = async (
    params: { page: number; limit: number; type?: string }
): Promise<PaginationResponse<CategoryResponse>> => {
    const { page, limit, type } = params;
    const response = await api.get("/admin/get-all-category", {
        params: {
            page,
            limit,
            type
        }
    });
    return response.data;
};


export const createCategoryAdminApi = async (
    formData: FormData
): Promise<BackendResponse<CreateCategoryResponse>> => {
    const response = await api.post("/admin/create-category", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateCategoryApi = async (id: string, formData: FormData) => {
    const { data } = await api.put(`/admin/category-update/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};

export const deleteCategoryApi = async ({ id, type }: { id: string; type: string }) => {
    const response = await api.delete(`/admin/category-delete/${id}`, {
        params: { type: type } 
    });
    return response.data;
};