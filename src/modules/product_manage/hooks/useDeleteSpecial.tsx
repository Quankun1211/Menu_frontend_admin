import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSpecialApi } from "../services/api";

const useDeleteSpecial = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteSpecialApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-specials-admin"] });
      message.success("Đã ngừng kinh doanh đặc sản");
    },
    onError: (error: unknown) => {
      const responseError = error as { error?: string; message?: string };
      message.error(responseError.message || responseError.error || "Không thể xóa đặc sản");
    },
  });

  return { deleteSpecial: mutation.mutate, isDeleting: mutation.isPending };
};

export default useDeleteSpecial;
