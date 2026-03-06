import { useQuery } from "@tanstack/react-query";
import { getRecipeByIdApi } from "../services/api";
import type { RecipeFilters } from "../types/api-request";

const useGetRecipeDetail = (id: string) => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["get-all-recipes-admin", id],
    queryFn: () => getRecipeByIdApi(id),
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

export default useGetRecipeDetail;