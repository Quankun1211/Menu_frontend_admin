import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getShippingFee, updateShippingFee } from "../services/api";

export const useShippingFee = () =>
  useQuery({
    queryKey: ["admin", "shipping-fee"],
    queryFn: getShippingFee,
    staleTime: 60_000,
  });

export const useUpdateShippingFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateShippingFee,
    onSuccess: (shippingFee) => {
      queryClient.setQueryData(["admin", "shipping-fee"], shippingFee);
    },
  });
};
