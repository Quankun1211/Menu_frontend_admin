import { useQuery } from "@tanstack/react-query";
import { getAllRecipesApi } from "../services/api";
import type { RecipeFilters } from "../types/api-request";

const useGetAllRecipes = (params: RecipeFilters) => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["get-all-recipes-admin", params],
    queryFn: () => getAllRecipesApi(params),
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

export default useGetAllRecipes;