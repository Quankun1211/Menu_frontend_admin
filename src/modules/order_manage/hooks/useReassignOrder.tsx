import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { onReassignOrderApi } from "../services/api";

const useReassignOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: onReassignOrderApi,
    onSuccess: () => {
      message.success("Đã đổi shipper thành công");
      queryClient.invalidateQueries({ queryKey: ["get-all-orders-admin"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => message.error(error?.message || "Không thể đổi shipper"),
  });
};

export default useReassignOrder;
