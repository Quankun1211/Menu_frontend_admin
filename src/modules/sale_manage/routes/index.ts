import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const saleManageRouter: RouteObject[] = [
    {
        path: "sales",
        lazy: lazyLoad(() => import("../pages/SaleManage"))
    }
]