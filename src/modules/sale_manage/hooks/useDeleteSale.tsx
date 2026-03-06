import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSaleApi } from "../services/api";
import { message } from "antd";

const useDeleteSale = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: (id: string) => deleteSaleApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-sales"] });
            message.success("Đã xóa chương trình giảm giá");
        },
        onError: (err: any) => {
            message.error(err.response?.data?.message || "Lỗi khi xóa");
        }
    });
    return { deleteSale: mutate, isDeleting: isPending };
};
export default useDeleteSale;