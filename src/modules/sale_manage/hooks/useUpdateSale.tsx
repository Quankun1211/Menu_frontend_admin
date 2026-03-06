import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSaleApi } from "../services/api";
import { message } from "antd";

const useUpdateSale = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: updateSaleApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-sales"] });
            message.success("Cập nhật thành công");
        },
        onError: (err: any) => {
            message.error(err.response?.data?.message || "Lỗi khi cập nhật");
        }
    });
    return { updateSale: mutate, isUpdating: isPending };
};
export default useUpdateSale;