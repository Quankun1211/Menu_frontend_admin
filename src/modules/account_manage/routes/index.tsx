import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const accountManageRouter: RouteObject[] = [
    {
        path: "users",
        lazy: lazyLoad(() => import("../pages/AccountManage"))
    }
]