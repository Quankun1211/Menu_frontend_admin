import { useQuery } from "@tanstack/react-query";
import { getAllProductAdminApi } from "../services/api";

const useGetAllProducts = (params: { page: number; limit: number; status: string, search ?:string }) => {
    const { data, isPending, isError, error, refetch } = useQuery({
        queryKey: ["get-all-products-admin", params.page, params.limit, params.status, params.search],
        queryFn: () => getAllProductAdminApi(params),
    });

    return { data, isPending, isError, error, refetch };
};

export default useGetAllProducts;