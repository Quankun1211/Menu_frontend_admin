import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductAdminApi } from "../services/api";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      updateProductAdminApi(id, data),
    
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công!");
      
      queryClient.invalidateQueries({ queryKey: ["get-all-products-admin"] });
      queryClient.invalidateQueries({ queryKey: ["get-product-detail"] });
      
      navigate("/manage/list/products");
    },
    
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật";
      message.error(errorMsg);
    },
  });

  return {
    updateProduct: mutate,
    isUpdating: isPending,
  };
};

export default useUpdateProduct;