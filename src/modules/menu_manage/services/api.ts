import type { BackendResponse } from "../../../libs/shared/types/backend-response";
import api from "../../../services/axios";
import type { PaginationResponse } from "../../../types/api-response";
import type { MenuResponse } from "../types/api-response";

export const getAllMenuApi = async (
    params: { page: number; limit: number; category?: string | undefined } 
): Promise<PaginationResponse<MenuResponse>> => {
    
    const { page, limit, category } = params;
    const response = await api.get("/admin/get-all-menus", {
        params: {
            page,
            limit,
            category
        }
    });
    return response.data;
};

export const createMenuApi = async (formData: FormData): Promise<BackendResponse<MenuResponse>> => {
    const response = await api.post("/admin/create-menu", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateMenuApi = async (id: string, formData: FormData): Promise<BackendResponse<MenuResponse>> => {
    const response = await api.put(`/admin/menu-update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return response.data;
};

export const deleteMenuApi = async (id: string): Promise<BackendResponse<MenuResponse>> => {
    const response = await api.delete(`/admin/menu-delete/${id}`)
    return response.data;
};

export const getMenuByIdApi = async (id: string) => {
    const { data } = await api.get(`/admin/get-menu-detail/${id}`);
    return data;
};