import { Form } from "antd";
import type { RegisterRequest } from "../types/api-request";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { validators } from "tailwind-merge";
function RegisterForm({ 
    onFinish
} : {
    onFinish: (values: RegisterRequest) => void
}) {
    return (
        <Form
            onFinish={onFinish}
            onFinishFailed={() => {
                console.log("Register failed")
            }}
            layout="vertical"
            autoComplete="off"
            className="flex flex-col items-center"
        >
            <Form.Item<RegisterRequest>
                className="w-full mb-2.5"
                name="name"
                label={
                    <label className="text-[14px] dark:text-gray-300">
                        Họ và tên
                    </label>
                }
                rules={[
                    {
                        required: true,
                        message: "Hãy nhập đầy đủ tên của bạn!"
                    }
                ]}
            >
                <Input
                    className="w-full h-8 rounded-[50px] border-[#D9D9D9] border pl-3 text-[14px] font-light placeholder:text-[13px]"
                    type="text"
                    tabIndex={1}
                    placeholder="Nhập họ và tên của bạn"
                />
            </Form.Item>

            <Form.Item<RegisterRequest>
                className="w-full mb-2.5"
                name="email"
                label={
                    <label className="text-[14px] dark:text-gray-300">
                        Địa chỉ Email
                    </label>
                }
                rules={[
                    {
                        required: true,
                        message: "Nhập địa chỉ Email của bạn!"
                    }
                ]}
            >
                <Input
                    className="w-full h-8 rounded-[50px] border-[#D9D9D9] border pl-3 text-[14px] font-light placeholder:text-[13px]"
                    type="email"
                    tabIndex={1}
                    placeholder="nguyenvana@example.com"
                />
            </Form.Item>

            <Form.Item<RegisterRequest>
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
                        message: "Tạo tên đăng nhập của bạn!"
                    }
                ]}
            >
                <Input
                    className="w-full h-8 rounded-[50px] border-[#D9D9D9] border pl-3 text-[14px] font-light placeholder:text-[13px]"
                    type="text"
                    tabIndex={1}
                    placeholder="Tạo tên đăng nhập"
                />
            </Form.Item>

            <Form.Item<RegisterRequest>
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
                    placeholder="Vui long nhập mật khẩu"
                />
            </Form.Item>

            <Form.Item<RegisterRequest>
                className="w-full mb-2.5"
                name="confirm_password"
                label={
                    <label className="text-[14px] dark:text-gray-300">
                        Xác nhận mật khẩu
                    </label>
                }
                dependencies={["password"]}
                rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập lại mật khẩu!",
                    },
                    ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                        }
                        return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp!")
                        );
                    },
                    }),
                ]}
            >
                <Input
                    className="w-full h-8 rounded-[50px] border-[#D9D9D9] border pl-3 text-[14px] font-light placeholder:text-[13px]"
                    type="password"
                    tabIndex={1}
                    placeholder="Nhập lại mật khẩu"
                />
            </Form.Item>

            <Button className="w-1/3 h-10 mt-4 bg-[#4ba64bd7]! text-white!" htmlType="submit">
                Đăng ký
            </Button>
        </Form>
    )
}

export default RegisterForm