import { type JSX, useEffect } from "react";
import type { ComponentType } from "react";
import { Navigate } from "react-router";
import { useAppStore } from "../store/app.store";
import useGetMe from "../hooks/useGetMe";

function AppHoc<T extends JSX.IntrinsicAttributes>(
    WrappedComponent: ComponentType<T>
) {
    const AuthenticatedComponent = (props: T) => {
        const { setUserData } = useAppStore();
        const { data: meData, isError, isPending } = useGetMe(true);

        useEffect(() => {
            if (meData?.data) {
                const user = meData.data;
                if (!["admin", "super_admin"].includes(user.role)) return;
                const jwtPayload = {
                    username: user.username,
                    role: user.role,
                    email: user.email,
                    name: user.name,
                    sub: user.id.toString(),
                    userId: user.id.toString(),
                    avatar: user.avatar
                };
                setUserData(jwtPayload);
            }
        }, [meData, setUserData]);

        if (isPending) return <div className="flex h-screen items-center justify-center text-gray-500">Đang xác thực...</div>;
        if (
            isError ||
            !meData?.data ||
            !["admin", "super_admin"].includes(meData.data.role)
        ) {
            return <Navigate to="/account/login" replace />;
        }
        return <WrappedComponent {...props} />;
    };
    return AuthenticatedComponent;
}

export default AppHoc;
