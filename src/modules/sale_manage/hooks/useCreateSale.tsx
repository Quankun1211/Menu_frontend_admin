import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSaleApi } from "../services/api";
import { message } from "antd";

const useCreateSale = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: createSaleApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-sales"] });
            message.success("Tạo chương trình giảm giá thành công");
        },
        onError: (err: any) => {
            message.error(err.response?.data?.message || "Lỗi khi tạo sale");
        }
    });
    return { createSale: mutate, isCreating: isPending };
};
export default useCreateSale;