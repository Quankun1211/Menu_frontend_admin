import { useQuery } from "@tanstack/react-query";
import { getAllMenuApi } from "../services/api";

const useGetAllMenu = (params: { page: number; limit: number; category?: string | undefined }) => {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["get-all-menu-admin", params.page, params.limit, params.category],
        queryFn: () => getAllMenuApi(params),
    });

    return { data, isLoading, isError, error, refetch };
};

export default useGetAllMenu;