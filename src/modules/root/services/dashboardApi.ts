import api from "../../../services/axios";
import type { BackendResponse } from "../../../libs/shared/types/backend-response";
import type { DashboardData } from "../types/dashboard";

export const getDashboardApi = async (period: number): Promise<BackendResponse<DashboardData>> => {
  const response = await api.get("/admin/dashboard", { params: { period } });
  return response.data;
};
