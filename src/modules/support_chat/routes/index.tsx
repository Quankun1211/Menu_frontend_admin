import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";
export const supportChatRouter: RouteObject[] = [{ path: "/support-chat", lazy: lazyLoad(() => import("../pages/SupportChat")) }];
