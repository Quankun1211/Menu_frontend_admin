import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserApi } from "../services/api";
import { message } from "antd";

const useUpdateUserData = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, values }: { id: string; values: any }) => updateUserApi(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success("Cập nhật thông tin thành công");
        },
        onError: (err: any) => {
            message.error(err.response?.data?.message || "Có lỗi xảy ra");
        }
    });

    return { mutate, isUpdating: isPending };
};

export default useUpdateUserData;