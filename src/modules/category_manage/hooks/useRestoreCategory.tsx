import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreCategoryApi } from "../services/api";
import { message } from "antd";

const useRestoreCategory = () => {
    const queryClient = useQueryClient();
    
    const { mutate, isPending } = useMutation({
        mutationFn: restoreCategoryApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-all-category-admin"] });
            message.success("Kích hoạt danh mục thành công");
        },
        onError: (err: any) => {
            message.error(err.message || "Có lỗi xảy ra");
        }
    });

    return { restoreCategory: mutate, isRestoring: isPending };
};

export default useRestoreCategory;