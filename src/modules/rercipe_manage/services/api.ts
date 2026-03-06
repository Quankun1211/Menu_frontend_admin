import type { BackendResponse } from "../../../libs/shared/types/backend-response";
import api from "../../../services/axios";
import type { PaginationResponse } from "../../../types/api-response";
import type { IngredientResponse, RecipeResponse } from "../types/api-response";

export const getAllRecipesApi = async (params: any): Promise<PaginationResponse<RecipeResponse>> => {
    const response = await api.get("/admin/get-all-recipes", { params });
    return response.data;
};

export const getAllIngredientsApi = async (params: any): Promise<PaginationResponse<IngredientResponse>> => {
    const response = await api.get("/admin/get-all-ingredients", { params });
    return response.data;
};

export const createIngredientApi = async (data: any): Promise<BackendResponse<IngredientResponse>> => {
    const response = await api.post("/admin/create-ingredient", data);
    return response.data;
};

export const updateIngredientApi = async ({ id, data }: { id: string; data: IngredientResponse }): Promise<BackendResponse<any>> => {
    const response = await api.put(`/admin/ingredient-update/${id}`, data);
    return response.data;
};

export const deleteIngredientApi = async (id: string): Promise<BackendResponse<IngredientResponse>> => {
    const response = await api.delete(`/admin/ingredient-delete/${id}`);
    return response.data;
};

export const createRecipeApi = async (formData: FormData): Promise<BackendResponse<RecipeResponse>> => {
    const response = await api.post("/admin/create-recipe", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const updateRecipeApi = async (id: string, formData: FormData) => {
  const { data } = await api.put(`/admin/recipe-update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteRecipeApi = async (id: string) => {
  const { data } = await api.delete(`/admin/recipe-delete/${id}`);
  return data;
};

export const getRecipeByIdApi = async (id: string) => {
    const { data } = await api.get(`/admin/get-recipe-detail/${id}`);
    return data;
};