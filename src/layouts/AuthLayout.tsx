import { Outlet } from "react-router";
import AuthHoc from "../hocs/authHocs.js";

const AuthLayout = () => {
    return (
        <div className="auth-layout-container">
            <Outlet/>
        </div>
    )
}

export default AuthHoc(AuthLayout)