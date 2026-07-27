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
      queryClient.invalidateQueries({ queryKey: ["get-recipe-detail-admin"] });
    },
    onError: (error: unknown) => {
      const responseError = error as { error?: string; message?: string };
      message.error(responseError.message || responseError.error || "Cập nhật thất bại!");
    }
  });

  return { updateRecipe, isUpdating };
};

export default useUpdateRecipe;
