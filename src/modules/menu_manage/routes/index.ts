import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const menuManageRouter: RouteObject[] = [
    {
        path: "menus",
        children: [
            {
                path: "",
                lazy: lazyLoad(() => import("../pages/MenuManage"))
            },
            {
                path: "add",
                lazy: lazyLoad(() => import("../components/AddMenu"))
            },
            {
                path: "edit/:id", 
                lazy: lazyLoad(() => import("../components/EditMenu"))
            },
        ]
    }
]
