import { ComponentType, JSX } from "react";
import { Navigate } from "react-router";
import useGetMe from "../hooks/useGetMe";

function AuthHoc<T extends JSX.IntrinsicAttributes>(
    WrappedComponent: ComponentType<T>
) {
    const AuthenticatedComponent = (props: T) => {
        const { data, isPending } = useGetMe(true);

        if (isPending) {
            return <div className="flex h-screen items-center justify-center text-gray-500">Đang xác thực...</div>;
        }
        if (data?.data && ["admin", "super_admin"].includes(data.data.role)) {
            return <Navigate to="/" replace />;
        }

        return <WrappedComponent {...props} />;
    };
    return AuthenticatedComponent;
}

export default AuthHoc;
