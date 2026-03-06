import { useQuery } from "@tanstack/react-query";
import { getAllAvailableSalesApi } from "../services/api";

const useGetAllAvailableSale = () => {
    const { data, isPending, isError, error, refetch } = useQuery({
        queryKey: ["available-sales"],
        queryFn: () => getAllAvailableSalesApi(),
    });

    return { data, isPending, isError, error, refetch };
};

export default useGetAllAvailableSale;