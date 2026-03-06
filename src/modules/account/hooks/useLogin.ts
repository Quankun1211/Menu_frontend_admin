import { useNavigate } from "react-router";
import { useAppStore } from "../../../store/app.store";
import { useMutation } from "@tanstack/react-query";
import { onLogInApi } from "../services/api";
import { removeToken, setToken } from "../../../utils/token";
import { message } from "antd";

const useLogin = () => {
    const navigate = useNavigate();
    const { setUserData } = useAppStore();

    const { mutate, data, error, isPending, isError } = useMutation({
        mutationKey: ["login"],
        mutationFn: onLogInApi,
        onSuccess: (data) => {
            if (data?.data) {
                if (data.data.role === 'admin' || data.data.role === "super_admin") {
                    setToken(data.data.access_token);
                    setUserData({
                        username: data.data.username,
                        sub: data.data._id,
                        role: data.data.role,
                        userId: data.data._id,
                        avatar: data.data.avatar,
                        name: data.data.name,
                        email: data.data.email
                    });
                    navigate('/');
                } else {
                    removeToken();
                    setUserData(null);
                    message.error("Tài khoản không có quyền truy cập trang quản trị!");
                    navigate('/account/login');
                }
            } else {
                message.error("Tài khoản không tồn tại")
            }
        },
        onError: () => {
            message.error("Tài khoản không tồn tại")
        }
    });

    return { data, error, isPending, isError, mutate };
};

export default useLogin;