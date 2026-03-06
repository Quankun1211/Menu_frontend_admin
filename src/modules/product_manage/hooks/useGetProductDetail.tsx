import { useQuery } from "@tanstack/react-query";
import { getProductDetailApi } from "../services/api";

const useGetProductDetail = (id: string) => {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["get-product-detail", id],
        queryFn: () => getProductDetailApi(id),
        enabled: !!id, 
        retry: 1,
        staleTime: 5 * 60 * 1000, 
    });

    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
};

export default useGetProductDetail;