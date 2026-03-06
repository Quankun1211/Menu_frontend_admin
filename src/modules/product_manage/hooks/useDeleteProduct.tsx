import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductApi } from "../services/api";
import { message } from "antd";

const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    
    const { mutate, isPending } = useMutation({
        mutationFn: deleteProductApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-all-products-admin"] });
            queryClient.invalidateQueries({ queryKey: ["get-all-specials-admin"] });
            message.success("Xóa sản phẩm thành công");
        },
        onError: (err: any) => {
            message.error(err.message || "Có lỗi xảy ra");
        }
    });

    return { deleteProduct: mutate, isDeleting: isPending };
};

export default useDeleteProduct;