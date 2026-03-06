import { useEffect } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd'
import type { UserResponse } from '../types/api-response';
import type { UserUpdateRequest } from '../types/api-request';

interface UpdateUserDataProps {
    isModalOpen: boolean,
    setIsModalOpen: (check: boolean) => void,
    handleUpdateUser: (id:string, values: any) => void,
    form: any,
    user: UserResponse
}

const UpdateUserDataModal = ({ isModalOpen, setIsModalOpen, handleUpdateUser, form, user } : UpdateUserDataProps) => {

  const onFinish = (values: any) => {
    handleUpdateUser(user._id, values);
  };

  useEffect(() => {
    if (isModalOpen && user) {
      form.setFieldsValue({
        name: user.name,
        username: user.username,
        phone: user.phone,
        email: user.email,
        role: user.role,
      });
    }
  }, [isModalOpen, user, form]);

  return (
    <Modal
        title="Chỉnh sửa thông tin người dùng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item<UserUpdateRequest> name="name" label="Họ tên" rules={[{ required: true, message: "Nhập Họ tên" }]}>
            <Input />
          </Form.Item>
          
          <Form.Item<UserUpdateRequest> name="username" label="Tên đăng nhập" rules={[{ required: true, message: "Nhập Tên đăng nhập" }]}>
            <Input />
          </Form.Item>
          
          <Form.Item<UserUpdateRequest> name="email" label="Email" rules={[{ required: true, type: "email", message: "Nhập Email" }]}>
            <Input />
          </Form.Item>

          <Form.Item<UserUpdateRequest> name="phone" label="Số điện thoại" 
            rules={[
              { required: true, message: "Nhập Số điện thoại của người dùng" }, 
              {min: 10, message: "Số điện thoại tối thiểu 10 kí tự"},
              {max: 11, message: "Số điện thoại tối đa 11 kí tự"}
            ]}>
            <Input />
          </Form.Item>
          
          <Form.Item<UserUpdateRequest> name="role" label="Vai trò" rules={[{ required: true, message: "Chọn vai trò" }]}>
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="shipper">Shipper</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item<UserUpdateRequest> name="password" label="Mật khẩu mới">
            <Input.Password placeholder="Để trống nếu không muốn đổi mật khẩu" />
          </Form.Item>
          
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">Xác nhận</Button>
          </div>
        </Form>
      </Modal>
  )
}

export default UpdateUserDataModal