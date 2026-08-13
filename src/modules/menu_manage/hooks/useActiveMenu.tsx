import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { activeMenuApi } from "../services/api";

const useActiveMenu = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: activeMenuApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-menu-admin"] });
      message.success("Đã kích hoạt lại thực đơn");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi khi xóa nguyên liệu");
    },
  });

  return { activeMenu: mutate, isActivating: isPending };
};

export default useActiveMenu;