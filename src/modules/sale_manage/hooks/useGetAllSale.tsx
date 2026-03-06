import { useQuery } from "@tanstack/react-query";
import { getAllSalesApi } from "../services/api";

const useGetAllSale = () => {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["all-sales"],
        queryFn: () => getAllSalesApi(),
    });

    return { data, isLoading, isError, error, refetch };
};

export default useGetAllSale;