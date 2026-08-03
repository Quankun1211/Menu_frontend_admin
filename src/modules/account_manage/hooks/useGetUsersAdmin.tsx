import { useQuery } from "@tanstack/react-query";
import { getAdminsAndShippersApi } from "../services/api";

const useGetUsersAdmin = (params: { page: number; limit: number; role: string; search: string; availability?: "online" | "all"; orderId?: string }) => {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["users", params.page, params.limit, params.role, params.search, params.availability, params.orderId],
        queryFn: () => getAdminsAndShippersApi(params),
    });

    return { data, isLoading, isError, error, refetch };
};

export default useGetUsersAdmin;
