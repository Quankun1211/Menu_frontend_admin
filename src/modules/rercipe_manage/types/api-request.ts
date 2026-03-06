
export type RecipeRequest = {
  name?: string;
  description?: string;
  page?: number;
  limit?: number;
  search?: string;
  difficulty?: string;
  weatherTag?: string;
  category?: string;
}