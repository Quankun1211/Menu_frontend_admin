import { Navigate } from "react-router";
import { getToken } from "../utils/token";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const token = getToken();

    if (!token) {
        return <Navigate to="/account/login" replace />;
    }

    return children;
};

export default AdminRoute;