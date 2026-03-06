import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMenuApi } from "../services/api";
import { message } from "antd";

const useCreateMenu = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => createMenuApi(formData),
        onSuccess: (response) => {
            if (response.success) {
                message.success("Tạo thực đơn thành công!");
                queryClient.invalidateQueries({ queryKey: ["get-all-menu-admin"] });
            }
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.message || "Lỗi khi tạo thực đơn";
            message.error(errorMsg);
        },
    });
};

export default useCreateMenu