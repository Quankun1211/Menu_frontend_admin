export type MenuResponse = {
    meta: {
        servings: string;
        cookType: string;
        isPrepped: boolean
    },
    _id: string;
    title: string;
    titleBanner: string;
    description: string;
    image: string;
    category: {
        _id: string;
        name: string;
    },
    recipes: [{
        _id: string;
        image: string;
    }],
    cookTime: number;
    totalPrice: number
}