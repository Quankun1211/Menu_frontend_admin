import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const configManageRouter: RouteObject[] = [
  {
    path: "settings/shipping",
    lazy: lazyLoad(() => import("../pages/ShippingConfig")),
  },
];
