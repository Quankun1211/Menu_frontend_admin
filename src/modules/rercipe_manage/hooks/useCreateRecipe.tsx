import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { createRecipeApi } from "../services/api";

const useCreateRecipe = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (formData: FormData) => createRecipeApi(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-all-recipes-admin"] });
            message.success("Tạo công thức thành công!");
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.message || "Lỗi khi tạo công thức nấu ăn";
            message.error(errorMsg);
            console.error("Create Recipe Error:", error);
        }
    });

    return {
        createRecipe: mutate,
        isCreating: isPending
    };
};

export default useCreateRecipe;