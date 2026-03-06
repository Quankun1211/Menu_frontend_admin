import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { Suspense } from "react";
import AuthLayout from "../layouts/AuthLayout";
import Fallback from "../components/common/Fallback";
import { authRouter } from "../modules/account/routes";
import MainLayout from "../layouts/MainLayout";
import { rootRouter } from "../modules/root/routes";
import { accountManageRouter } from "../modules/account_manage/routes";
import { orderManageRouter } from "../modules/order_manage/routes";
import { manageRouter } from "../modules/product_manage/routes";
import { categoryRouter } from "../modules/category_manage/routes";
import { saleManageRouter } from "../modules/sale_manage/routes";
import { recipeManageRouter } from "../modules/rercipe_manage/routes";
import { ingredientManageRouter } from "../modules/rercipe_manage/routes";
import { menuManageRouter } from "../modules/menu_manage/routes";
const AuthLayoutWithSuspense = () => (
  <Suspense fallback={<Fallback />}>
    <AuthLayout />
  </Suspense>
);

const MainLayoutWithSuspense = () => (
    <Suspense fallback={<Fallback/>}>
        <MainLayout/>
    </Suspense>
)

const router = createBrowserRouter([
    {
        path: "/",
        hydrateFallbackElement: <Fallback/>,
        children: [
            {
                element: <AuthLayoutWithSuspense />,
                children: authRouter
            },
            {
                element: 
                <MainLayoutWithSuspense/>,
                children: [
                    ...rootRouter,
                    ...accountManageRouter,
                    ...orderManageRouter,
                    ...manageRouter,
                    ...categoryRouter,
                    ...saleManageRouter,
                    ...recipeManageRouter,
                    ...ingredientManageRouter,
                    ...menuManageRouter
                ]
            }
        ]
    }
])

export default router