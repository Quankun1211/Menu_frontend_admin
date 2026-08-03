import { useNavigate } from "react-router";
import { useAppStore } from "../../../store/app.store";
import { useMutation } from "@tanstack/react-query";
import { onLogInApi } from "../services/api";
import { message } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { setRefreshToken, setToken } from "../../../utils/token";

const useLogin = () => {
    const navigate = useNavigate();
    const { setUserData } = useAppStore();
    const queryClient = useQueryClient();

    const { mutate, data, error, isPending, isError } = useMutation({
        mutationKey: ["login"],
        mutationFn: onLogInApi,
        onSuccess: (data) => {
            if (data?.data) {
                if (data.data.role === 'admin' || data.data.role === "super_admin") {
                    setToken(data.data.access_token);
                    setRefreshToken(data.data.refresh_token);
                    setUserData({
                        username: data.data.username,
                        sub: data.data._id,
                        role: data.data.role,
                        userId: data.data._id,
                        avatar: data.data.avatar,
                        name: data.data.name,
                        email: data.data.email
                    });
                    queryClient.invalidateQueries({ queryKey: ["me"] });
                    navigate('/', { replace: true });
                } else {
                    setUserData(null);
                    message.error("Tài khoản không có quyền truy cập trang quản trị!");
                    navigate('/account/login', { replace: true });
                }
            } else {
                message.error("Phản hồi đăng nhập không hợp lệ")
            }
        }
    });

    return { data, error, isPending, isError, mutate };
};

export default useLogin;
