import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductAdminApi } from "../services/api";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const useCreateProduct = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: (formData: FormData) => createProductAdminApi(formData),
        onSuccess: () => {
            message.success("Thêm sản phẩm thành công!");
            
            queryClient.invalidateQueries({ queryKey: ["get-all-products-admin"] });
            queryClient.invalidateQueries({ queryKey: ["get-all-specials-admin"] });
            
            navigate("/manage/list/products");
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi tạo sản phẩm";
            message.error(errorMsg);
        },
    });

    return { 
        createProduct: mutate, 
        isCreating: isPending 
    };
};

export default useCreateProduct;