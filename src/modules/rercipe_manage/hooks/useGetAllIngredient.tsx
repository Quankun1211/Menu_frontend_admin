import { useQuery } from "@tanstack/react-query";
import { getAllIngredientsApi } from "../services/api";

const useGetAllIngredient = (params: any) => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["get-all-ingredient-admin", params],
    queryFn: () => getAllIngredientsApi(params),
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

export default useGetAllIngredient;