import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { updateIngredientApi } from "../services/api";

const useUpdateIngredient = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateIngredientApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-ingredient-admin"] });
      message.success("Cập nhật nguyên liệu thành công");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi cập nhật");
    },
  });

  return { updateIngredient: mutate, isUpdating: isPending };
};

export default useUpdateIngredient;