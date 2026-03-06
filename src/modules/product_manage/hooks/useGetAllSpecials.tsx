import { useQuery } from "@tanstack/react-query";
import { getAllSpecialAdminApi } from "../services/api";

const useGetAllSpecials = (params: { page: number; limit: number; status: string }) => {
    const { data, isPending, isError, error, refetch } = useQuery({
        queryKey: ["get-all-specials-admin", params.page, params.limit, params.status],
        queryFn: () => getAllSpecialAdminApi(params),
    });

    return { data, isPending, isError, error, refetch };
};

export default useGetAllSpecials;