import { useQuery } from "@tanstack/react-query";
import { getDashboardApi } from "../services/dashboardApi";

export const useDashboard = (period: number) =>
  useQuery({
    queryKey: ["admin-dashboard", period],
    queryFn: () => getDashboardApi(period),
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });
