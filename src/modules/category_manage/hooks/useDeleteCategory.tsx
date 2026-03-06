import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryApi } from "../services/api";
import { message } from "antd";

const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    
    const { mutate, isPending } = useMutation({
        mutationFn: deleteCategoryApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-all-category-admin"] });
            message.success("Xóa danh mục thành công");
        },
        onError: (err: any) => {
            message.error(err.message || "Có lỗi xảy ra");
        }
    });

    return { deleteCategory: mutate, isDeleting: isPending };
};

export default useDeleteCategory;