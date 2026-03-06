import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const orderManageRouter: RouteObject[] = [
    {
        path: "order",
        lazy: lazyLoad(() => import("../pages/OrderManage"))
    }
]