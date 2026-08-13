import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activeUserApi } from "../services/api";
import { message } from "antd";

const useActiveUser = () => {
    const queryClient = useQueryClient();
    
    const { mutate, isPending } = useMutation({
        mutationFn: activeUserApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success("Kích hoạt người dùng thành công");
        },
        onError: (err: any) => {
            message.error(err.message || "Có lỗi xảy ra");
        }
    });

    return { activeUser: mutate, isDeleting: isPending };
};

export default useActiveUser;