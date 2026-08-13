import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activeSpecialApi } from "../services/api";
import { message } from "antd";

const useActiveSpecial = () => {
    const queryClient = useQueryClient();
    
    const { mutate, isPending } = useMutation({
        mutationFn: activeSpecialApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-all-products-admin"] });
            queryClient.invalidateQueries({ queryKey: ["get-all-specials-admin"] });
            message.success("Kích hoạt đặc sản thành công");
        },
        onError: (err: any) => {
            message.error(err.message || "Có lỗi xảy ra");
        }
    });

    return { activeSpecial: mutate, isActivating: isPending };
};

export default useActiveSpecial;