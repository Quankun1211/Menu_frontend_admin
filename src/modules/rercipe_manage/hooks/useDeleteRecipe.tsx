import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { deleteRecipeApi } from "../services/api";

const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteRecipeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-recipes-admin"] });
      message.success("Đã xóa công thức");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi xóa nguyên liệu");
    },
  });

  return { deleteRecipe: mutate, isDeleting: isPending };
};

export default useDeleteRecipe;