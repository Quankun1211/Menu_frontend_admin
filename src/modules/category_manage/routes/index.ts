import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const categoryRouter: RouteObject[] = [
    {
        path: "manage",
        children: [
            {
                path: "category",
                lazy: lazyLoad(() => import("../pages/CategoryManage"))
            },
        ]
    }
]