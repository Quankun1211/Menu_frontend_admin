import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { createIngredientApi } from "../services/api";

const useCreateIngredient = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createIngredientApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-ingredient-admin"] });
      message.success("Thêm nguyên liệu thành công");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi tạo nguyên liệu");
    },
  });

  return { createIngredient: mutate, isCreating: isPending };
};

export default useCreateIngredient;