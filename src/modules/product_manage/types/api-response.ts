type CategoryItemResponse = {
    _id: string,
    name: string
}
type SaleItems = {
    _id: string,
    percent: number,
    startDate: Date,
    endDate: Date
}

export type ProductResponse = {
    _id: string,
    name: string,
    categoryId: CategoryItemResponse,
    price: number,
    unit: string,
    description: string,
    images: string,
    finalPrice: number,
    stock: string,
    soldCount: number,
    region: string,
    salePercent: SaleItems,
    origin: string,
    originDescription: string,
    originFound: string,
    story: string,
    nutrition: NutritionData,
    usage_instruction: string[],
    relatedRecipes: RecipeDetailResponse[],
}

export type CategoryResponse = {
    _id: string,
    name: string,
    slug: string,
    image?: string
}
export type CategoryMenuResponse = {
    _id: string,
    name: string,
    slug: string,
    title: string,
    description: string
}
export type CategoryRecipeResponse = {
    _id: string,
    name: string,
    slug: string,
    description: string
}

export interface NutritionData {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  description?: string;
}

export interface SuggestedSideDishes {
  dishes: string[];
  description?: string;
}

export type ExtraInfo = 
  | { type: 'folkTips'; data: string[] }
  | { type: 'nutrition'; data: NutritionData }
  | { type: 'suggestedSideDishes'; data: SuggestedSideDishes };

export interface IngredientResponse {
  _id: string;
  ingredientId: IngredientIdDetail;
  itemType: 'Product' | 'Ingredient';
  quantity: number | string;
  note?: string;
}

export interface AdditionalIngredients {
  _id: string;
  name: string;
  quantity: string;
  unit: string;
}

export interface Instructions {
  _id: string;
  step: number;
  title: string;
  description: string;
}

export interface MetaMenuResponse {
  servings: string;
  cookType: string;
  isPrepped: boolean;
}

export interface RecipeDetailResponse {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  category: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
  };
  ingredients: IngredientResponse[];
  additionalIngredients: AdditionalIngredients[];
  instructions: Instructions[];
  weatherTag: string;
  meta: MetaMenuResponse;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  instructionUrl?: string;
  cookTime: number;
  owner?: string | null;
  isSystem: boolean;
  extraInfo: ExtraInfo[];
  createdAt: string;
  updatedAt: string;
  isSaved: boolean;
  __v?: number;
}


export interface IngredientIdDetail {
    _id: string;
    name?: string; 
    customName?: string;
    images?: string; 
    image?: string;
    price: number;
    unit: string;
    slug?: string;
    createdAt?: string;
    updatedAt?: string;
    productId?: string;
    __v?: number;
    stock?: number;
    categoryId?: string;
}

export type RecipeResponse = {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    category: string | CategoryRecipeResponse;
    ingredients: IngredientResponse[];
    additionalIngredients: AdditionalIngredients[];
    instructions: Instructions[];
    weatherTag: string;
    tips: {
        folkTips: string[];
        nutrition: NutritionData;
    };
    suggestedSideDishes: SuggestedSideDishes;
    meta: MetaMenuResponse;
    difficulty: 'Dễ' | 'Trung bình' | 'Khó';
    instructionUrl?: string;
    cookTime: number;
    owner: string | null;
    isSystem: boolean;
    createdAt: string;
    updatedAt: string;
    isSaved: boolean;
    __v?: number;
}

export type MenuResponse = {
    _id: string;
    title: string;
    titleBanner: string;
    description: string;
    image: string;
    category: CategoryMenuResponse;
    meta: MetaMenuResponse;
    recipes: RecipeResponse[]; 
    cookTime: number;
    totalPrice: number;
    totalPriceInDB: number;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export type SaleResponse = {
  _id: string;
  percent: number;
  startDate: string;
  endDate: string;
}