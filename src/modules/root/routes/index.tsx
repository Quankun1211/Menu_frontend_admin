import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const rootRouter: RouteObject[] = [
    {
        index: true,
        lazy: lazyLoad(() => import("../pages/Dashboard"))
    }
]