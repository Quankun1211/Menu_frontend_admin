import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRecipeApi } from '../services/api';
import { message } from 'antd';

const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  const { mutate: updateRecipe, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      updateRecipeApi(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-recipes-admin"] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Cập nhật thất bại!");
    }
  });

  return { updateRecipe, isUpdating };
};

export default useUpdateRecipe;