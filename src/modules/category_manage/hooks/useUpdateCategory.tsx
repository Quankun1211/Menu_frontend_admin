import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategoryApi } from "../services/api";
import { message } from "antd";
import type { CreateCategoryRequest } from "../types/api-request";

const useUpdateCategoryData = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
            updateCategoryApi(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-all-category-admin"] });
            message.success("Cập nhật thông tin thành công");
        },
        onError: (err: unknown) => {
            const responseError = err as { error?: string; message?: string };
            message.error(
                responseError?.message ||
                responseError?.error ||
                "Không thể cập nhật danh mục"
            );
        }
    });

    return { mutate, isUpdating: isPending };
};

export default useUpdateCategoryData;
