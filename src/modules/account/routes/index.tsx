import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";
import { lazy } from "react";

export const authRouter: RouteObject[] = [
    {
        path: "account",
        children: [
            {
                path: "login",
                lazy: lazyLoad(() => import("../pages/SignIn"))
            },
            {
                path: "register",
                lazy: lazyLoad(() => import("../pages/SignUp"))
            },
            {
                path: "forgot-password",
                children: [
                    {
                        path: "",
                        lazy: lazyLoad(() => import("../pages/ForgotPassword"))
                    },
                    {
                        path: "verify",
                        lazy: lazyLoad(() => import("../pages/VerifyCode"))
                    }
                ]
            },
            {
                path: "change-password",
                lazy: lazyLoad(() => import("../pages/ChangePassword"))
            }
        ]
    }
]