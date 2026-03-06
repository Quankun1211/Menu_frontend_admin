import { Button, Form, Input, Modal, Select } from 'antd'
import type { UserRegisterRequest } from '../types/api-request';

interface AddUserProps {
    isModalOpen: boolean,
    setIsModalOpen: (check: boolean) => void,
    handleCreateUser: (values: any) => void,
    form: any
}
const AddUserModal = ({ isModalOpen, setIsModalOpen, handleCreateUser, form } : AddUserProps) => {

  return (
    <Modal
        title="Thêm người dùng mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreateUser} className="mt-4">
          <Form.Item<UserRegisterRequest> name="name" label="Họ tên" rules={[{ required: true, message: "Nhập Họ tên của người dùng" }]}>
            <Input />
          </Form.Item>
          <Form.Item<UserRegisterRequest> name="username" label="Tên đăng nhập" rules={[{ required: true, message: "Nhập Tên đăng nhập của người dùng" }]}>
            <Input />
          </Form.Item>
          <Form.Item<UserRegisterRequest> name="email" label="Email" rules={[{ required: true, type: "email", message: "Nhập Email của người dùng" }]}>
            <Input />
          </Form.Item>
          <Form.Item<UserRegisterRequest> name="phone" label="Số điện thoại" 
            rules={[
              { required: true, message: "Nhập Số điện thoại của người dùng" }, 
              {min: 10, message: "Số điện thoại tối thiểu 10 kí tự"},
              {max: 11, message: "Số điện thoại tối đa 11 kí tự"}
            ]}>
            <Input />
          </Form.Item>
          <Form.Item<UserRegisterRequest> name="role" label="Vai trò" rules={[{ required: true, message: "Chọn vai trò" }]}>
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="shipper">Shipper</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item<UserRegisterRequest> name="password" label="Mật khẩu" 
            rules={[
              { required: true, message: "Nhập mật khẩu",  },
              {
                  min: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự!"
              }  
            ]}>
            <Input.Password />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">Xác nhận</Button>
          </div>
        </Form>
      </Modal>
  )
}

export default AddUserModal