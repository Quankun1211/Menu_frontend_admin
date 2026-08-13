import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { activeRecipeApi } from "../services/api";

const useActiveRecipe = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: activeRecipeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-recipes-admin"] });
      message.success("Kích hoạt công thức thành công");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi xóa nguyên liệu");
    },
  });

  return { activeRecipe: mutate, isActivating: isPending };
};

export default useActiveRecipe;