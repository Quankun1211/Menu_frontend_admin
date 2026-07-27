import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMenuApi } from '../services/api';
import { message } from 'antd';

const useUpdateMenu = () => {
  const queryClient = useQueryClient();

  const { mutate: updateMenu, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      updateMenuApi(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-menu-admin"] });
      queryClient.invalidateQueries({ queryKey: ["get-menu-detail-admin"] });
      message.success("Cập nhật thực đơn thành công!");
    },
    onError: (error: unknown) => {
      const responseError = error as { error?: string; message?: string };
      message.error(responseError.message || responseError.error || "Cập nhật thất bại!");
    }
  });

  return { updateMenu, isUpdating };
};

export default useUpdateMenu;
