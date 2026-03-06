export type RecipeResponse = {
    _id: string;
    name: string;
    image: string;
    category: {
        _id: string;
        name: string;
    },
    weatherTag: string;
    difficulty: string;
    cookTime: number;
}

export type IngredientResponse = {
    _id: string;
    customeName: string;
    price: number;
    image: string;
    unit: string
}