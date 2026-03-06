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
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Cập nhật thất bại!");
    }
  });

  return { updateMenu, isUpdating };
};

export default useUpdateMenu;