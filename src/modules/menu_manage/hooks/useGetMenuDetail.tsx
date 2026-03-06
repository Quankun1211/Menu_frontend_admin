import { useQuery } from "@tanstack/react-query";
import { getMenuByIdApi } from "../services/api";

const useGetMenuDetail = (id: string) => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["get-all-recipes-admin", id],
    queryFn: () => getMenuByIdApi(id),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data,
    isPending,
    isError,
    error,
    refetch,
  };
};

export default useGetMenuDetail;