export type CategoryResponse = {
    image: string;
    name: string;
    description: string;
    title: string;
}

export type CreateCategoryResponse = {
    success: boolean;
    data: CategoryResponse;
    message?: string;
};