import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onRegisterUserApi } from "../services/api";
import { message } from "antd";

const useCreateUser = () => {
    const queryClient = useQueryClient();

    const { data, error, isPending, isError, mutate } = useMutation({
        mutationKey: ["register-user"],
        mutationFn: onRegisterUserApi,
        onSuccess: () => {
            message.success("Đã tạo người dùng thành công");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    return { data, error, isPending, isError, mutate };
};

export default useCreateUser;