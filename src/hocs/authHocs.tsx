import { ComponentType, JSX, useEffect } from "react";
import { useNavigate } from "react-router";
import { getToken } from "../utils/token";

function AuthHoc<T extends JSX.IntrinsicAttributes>(
    WrappedComponent: ComponentType<T>
) {
    const AuthenticatedComponent = (props: T) => {
        const navigate = useNavigate();
        const token = getToken();

        useEffect(() => {
            if (token) {
                navigate("/");
            }
        }, [token, navigate]);

        return <WrappedComponent {...props} />;
    };
    return AuthenticatedComponent;
}

export default AuthHoc;