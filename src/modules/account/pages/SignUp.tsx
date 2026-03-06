import PageMeta from "../../../components/common/PageMeta"
import LoginForm from "../components/LoginForm"
import banner from "../../../assets/images/banner.png"
import type { FormProps } from "antd"
import type { RegisterRequest } from "../types/api-request"
import useRegister from "../hooks/useRegister"
import RegisterForm from "../components/RegisterForm"
export default function SignUp() {
    const {mutate: onRegister} = useRegister()
    const onFinish: FormProps<RegisterRequest>["onFinish"] = async (values) => {
        await onRegister(
            {
                email: values.email,
                username: values.username,
                password: values.password,
                confirm_password: values.confirm_password,
                name: values.name,
                agree: false
            },
            {
                onSuccess: () => {
                    console.log("Register successfully")
                },
                onError: (error) => {
                    console.log("Register failed")
                }
            }
        )
    }
    return (
        <div className="min-h-screen w-full flex justify-center items-center p-6 bg-[#f0f9f0]">
            <PageMeta title="Trang dang nhap" description=""/>
            <div className="bg-[#f0f9f0] shadow-2xl flex rounded-4xl overflow-hidden w-[90%] mt-[4%] gap-10 pl-5">
                <div className="w-1/2 py-5">
                    <h1 className="text-center text-3xl font-bold">Tạo tài khoản mới</h1>
                    <h1 className="my-4 text-[#4a8d4a]">Khám phá thế giới ẩm thực tươi ngon mỗi ngày cùng chúng tôi</h1>
                    <RegisterForm onFinish={onFinish}/>
                </div>
                <img src={banner} alt="Banner" className="w-1/2 rounded-4xl"/>
            </div>
        </div>
    )
}