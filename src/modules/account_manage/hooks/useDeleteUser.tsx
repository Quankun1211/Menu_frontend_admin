import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserApi } from "../services/api";
import { message } from "antd";

const useDeleteUser = () => {
    const queryClient = useQueryClient();
    
    const { mutate, isPending } = useMutation({
        mutationFn: deleteUserApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success("Xóa người dùng thành công");
        },
        onError: (err: any) => {
            message.error(err.message || "Có lỗi xảy ra");
        }
    });

    return { deleteUser: mutate, isDeleting: isPending };
};

export default useDeleteUser;