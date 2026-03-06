import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryAdminApi } from "../services/api";
import { message } from "antd";

const useCreateCategory = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (formData: FormData) => createCategoryAdminApi(formData),
        onSuccess: () => {
            message.success("Thêm danh mục thành công!");
            queryClient.invalidateQueries({ queryKey: ["get-all-category-admin"] });
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi tạo danh mục";
            message.error(errorMsg);
        },
    });

    return { 
        createCategory: mutate, 
        isCreating: isPending 
    };
};

export default useCreateCategory;