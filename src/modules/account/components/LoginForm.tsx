import { Form } from "antd";
import type { logInRequest } from "../types/api-request";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

function LoginForm({onFinish} : {onFinish: (values: logInRequest) => void}) {
    return (
        <Form
            onFinish={onFinish}
            onFinishFailed={() => {
                console.log("Login failed")
            }}
            layout="vertical"
            autoComplete="off"
            className="flex flex-col items-center"
        >
            <Form.Item<logInRequest>
                className="w-full mb-2.5"
                name="username"
                label={
                    <label className="text-[14px] dark:text-gray-300">
                        Tên đăng nhập
                    </label>
                }
                rules={[
                    {
                        required: true,
                        message: "Nhập đầy đủ tên đăng nhập!"
                    }
                ]}
            >
                <Input
                    className="w-full h-8 border-[#D9D9D9] border pl-3 text-[14px] font-light placeholder:text-[13px]"
                    type="text"
                    tabIndex={1}
                    placeholder="Vui lòng nhập tên đăng nhập hoặc địa chỉ Email"
                />
            </Form.Item>

            <Form.Item<logInRequest>
                className="w-full mb-2.5"
                name="password"
                label={
                    <label className="text-[14px] dark:text-gray-300">
                        Mật khẩu
                    </label>
                }
                rules={[
                    {
                        required: true,
                        message: "Hãy nhập đầy đủ mật khẩu của bạn!"
                    },
                    {
                        min: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự!"
                    }                    
                ]}
            >
                <Input
                    className="w-full h-8 rounded-[50px] border-[#D9D9D9] border pl-3 text-[14px] font-light placeholder:text-[13px]"
                    type="password"
                    tabIndex={1}
                    placeholder="Vui lòng nhập mật khẩu"
                />
            </Form.Item>

            <Button className="w-full mt-4 h-12! bg-blue-500! text-white!" htmlType="submit">
                Đăng nhập
            </Button>
        </Form>
    )
}

export default LoginForm