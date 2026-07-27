import { useQuery } from "@tanstack/react-query";
import { getSpecialDetailApi } from "../services/api";

const useGetSpecialDetail = (id: string) => {
  const query = useQuery({
    queryKey: ["get-special-detail", id],
    queryFn: () => getSpecialDetailApi(id),
    enabled: Boolean(id),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  return query;
};

export default useGetSpecialDetail;
