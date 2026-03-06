import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const manageRouter: RouteObject[] = [
    {
        path: "manage",
        children: [
            {
                path: "list/products",
                lazy: lazyLoad(() => import("../pages/ProductManage"))
            },
            {
                path: "list/specials",
                lazy: lazyLoad(() => import("../pages/SpecialManage"))
            },
            {
                path: "products/add",
                lazy: lazyLoad(() => import("../components/AddProductPage"))
            },
            {
                path: "products/edit/:id", 
                lazy: lazyLoad(() => import("../components/EditProductPage"))
            },
            {
                path: "specials/edit/:id", 
                lazy: lazyLoad(() => import("../components/EditSpecial"))
            },
        ]
    }
]