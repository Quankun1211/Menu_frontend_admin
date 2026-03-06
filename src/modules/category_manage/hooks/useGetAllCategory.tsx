import { useQuery } from "@tanstack/react-query";
import { getAllCategoryAdminApi } from "../services/api";

const useGetAllCategory = (params: { page: number; limit: number; type: string }) => {
    const { data, isPending, isError, error, refetch } = useQuery({
        queryKey: ["get-all-category-admin", params.page, params.limit, params.type],
        queryFn: () => getAllCategoryAdminApi(params),
    });

    return { data, isPending, isError, error, refetch };
};

export default useGetAllCategory;