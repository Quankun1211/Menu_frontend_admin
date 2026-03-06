import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { deleteMenuApi } from "../services/api";

const useDeleteMenu = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteMenuApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-menu-admin"] });
      message.success("Đã xóa thực đơn");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi xóa nguyên liệu");
    },
  });

  return { deleteMenu: mutate, isDeleting: isPending };
};

export default useDeleteMenu;