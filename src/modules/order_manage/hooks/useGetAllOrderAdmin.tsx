import { useQuery } from "@tanstack/react-query";
import { getAllOrderAdminApi } from "../services/api";

const useGetAllOrderAdmin = (params: { page: number; limit: number; status: string }) => {
    const { data, isPending, isError, error, refetch } = useQuery({
        queryKey: ["get-all-orders-admin", params.page, params.limit, params.status],
        queryFn: () => getAllOrderAdminApi(params),
    });

    return { data, isPending, isError, error, refetch };
};

export default useGetAllOrderAdmin;