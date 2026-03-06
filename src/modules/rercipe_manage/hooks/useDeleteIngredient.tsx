import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { deleteIngredientApi } from "../services/api";

const useDeleteIngredient = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteIngredientApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-ingredient-admin"] });
      message.success("Đã xóa nguyên liệu");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi xóa nguyên liệu");
    },
  });

  return { deleteIngredient: mutate, isDeleting: isPending };
};

export default useDeleteIngredient;