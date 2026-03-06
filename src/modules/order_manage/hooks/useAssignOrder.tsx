import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onAssignOrderApi } from "../services/api";
import { message } from "antd";

const useAssignOrder = () => {
    const queryClient = useQueryClient();

    const { data, error, isPending, isError, mutate } = useMutation({
        mutationKey: ["assign-order"],
        mutationFn: onAssignOrderApi,
        onSuccess: () => {
            message.success("Đã gán đơn cho shipper thành công");
            queryClient.invalidateQueries({ queryKey: ["get-all-orders-admin"] });
            queryClient.invalidateQueries({ queryKey: ["get-all-order-shipper"] });
        },
    });

    return { data, error, isPending, isError, mutate };
};

export default useAssignOrder;