import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activeProductApi } from "../services/api";
import { message } from "antd";

const useActiveProduct = () => {
    const queryClient = useQueryClient();
    
    const { mutate, isPending } = useMutation({
        mutationFn: activeProductApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-all-products-admin"] });
            queryClient.invalidateQueries({ queryKey: ["get-all-specials-admin"] });
            message.success("Kích hoạt sản phẩm thành công");
        },
        onError: (err: any) => {
            message.error(err.message || "Có lỗi xảy ra");
        }
    });

    return { activeProduct: mutate, isActivating: isPending };
};

export default useActiveProduct;