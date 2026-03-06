import { type JSX, useEffect } from "react";
import type { ComponentType } from "react";
import { useNavigate } from "react-router";
import { useAppStore } from "../store/app.store";
import { getToken } from "../utils/token";
import useGetMe from "../hooks/useGetMe";

function AppHoc<T extends JSX.IntrinsicAttributes>(
    WrappedComponent: ComponentType<T>
) {
    const AuthenticatedComponent = (props: T) => {
        const navigate = useNavigate();
        const token = getToken();
        const { setUserData } = useAppStore();
        const { data: meData, isError } = useGetMe(!!token);

        useEffect(() => {
            if (!token) {
                navigate("/account/login");
            }
        }, [token, navigate]);

        useEffect(() => {
            if (isError) {
                navigate("/account/login");
            }
        }, [isError, navigate]);

        useEffect(() => {
            if (meData?.data) {
                const user = meData.data;
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

        return <WrappedComponent {...props} />;
    };
    return AuthenticatedComponent;
}

export default AppHoc;