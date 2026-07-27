import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSpecialAdminApi } from "../services/api";

const useUpdateSpecial = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateSpecialAdminApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-specials-admin"] });
      queryClient.invalidateQueries({ queryKey: ["get-special-detail"] });
      message.success("Cập nhật đặc sản thành công");
    },
    onError: (error: unknown) => {
      const responseError = error as { error?: string; message?: string };
      message.error(responseError.message || responseError.error || "Không thể cập nhật đặc sản");
    },
  });

  return { updateSpecial: mutation.mutate, isUpdating: mutation.isPending };
};

export default useUpdateSpecial;
