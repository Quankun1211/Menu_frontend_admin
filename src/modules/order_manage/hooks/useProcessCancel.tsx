import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onProcessCancelApi } from "../services/api";
import { message } from "antd";
import type { CancelProcessRequest } from "../types/api-request";

const useProcessCancel = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ values }: { values: CancelProcessRequest }) => onProcessCancelApi(values),
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success("Xử lý yêu cầu hủy thành công");
        },
        onError: (err: any) => {
            message.error(err.response?.data?.message || "Có lỗi xảy ra");
        }
    });

    return { mutate, isUpdating: isPending };
};

export default useProcessCancel;