import PageMeta from "../../../components/common/PageMeta"
import LoginForm from "../components/LoginForm"
import useLogin from "../hooks/useLogin"
import type { FormProps } from "antd"
import type { logInRequest } from "../types/api-request"

export default function SignIn() {
    const { mutate: onLogin } = useLogin()
    const onFinish: FormProps<logInRequest>["onFinish"] = (values) => {
        onLogin({...values})
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <PageMeta title="Trang đăng nhập" description=""/>
            <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold mb-2 text-center">Chào mừng quay trở lại</h2>
                <p className="text-gray-500 mb-8 text-center">Vui lòng nhập thông tin tài khoản của bạn để tiếp tục.</p>
                
                <LoginForm onFinish={onFinish}/>
                
                <div className="text-center mt-6 text-sm text-gray-500">
                    Bạn chưa có tài khoản? <a href="#" className="text-blue-600 font-medium">Liên hệ quản trị viên</a>
                </div>
                
                <p className="text-center text-xs text-gray-400 mt-10">© 2024 AdminPanel. Tất cả quyền được bảo lưu.</p>
            </div>
        </div>
    )
}