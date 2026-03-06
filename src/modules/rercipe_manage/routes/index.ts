import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const recipeManageRouter: RouteObject[] = [
    {
        path: "recipes",
        children: [
            {
                path: "",
                lazy: lazyLoad(() => import("../pages/RecipeManage"))
            },
            {
                path: "add",
                lazy: lazyLoad(() => import("../components/AddRecipe"))
            },
            {
                path: "edit/:id", 
                lazy: lazyLoad(() => import("../components/EditRecipe"))
            },
        ]
    }
]

export const ingredientManageRouter: RouteObject[] = [
    {
        path: "ingredients",
        lazy: lazyLoad(() => import("../pages/IngredientManage"))
    }
]