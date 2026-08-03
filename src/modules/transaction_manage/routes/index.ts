import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const transactionManageRouter: RouteObject[] = [
  {
    path: "/transactions",
    lazy: lazyLoad(() => import("../pages/TransactionManage")),
  },
];
