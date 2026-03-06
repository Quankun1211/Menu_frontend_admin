import { useState, useEffect } from "react";
import { Table, Button, Input, Select, Tag, Space, Avatar, Modal, Form, message } from "antd";
import { Search, Plus, Download, Edit, Trash2 } from "lucide-react";
import useGetAdminsAndShippers from "../hooks/useGetUsersAdmin";
import AddUserModal from "../components/AddUserModal";
import useCreateUser from "../hooks/useCreateUser";
import useDeleteUser from "../hooks/useDeleteUser";
import UpdateUserDataModal from "../components/UpdateUserDataModal";
import useUpdateUserData from "../hooks/useUpdateUserData";
import PageContainer from "../../../components/ui/PageContainer";

const AccountManage = () => {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { mutate: createUser } = useCreateUser();
  const { mutate: updateUser } = useUpdateUserData();
  const { deleteUser } = useDeleteUser();
  
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useGetAdminsAndShippers({ 
    page, 
    limit: 10, 
    role, 
    search: debouncedSearch 
  });

  const handleCreateUser = async (values: any) => {
    try {
      createUser(values);
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  const handleUpdateUser = async (id: string, values: any) => {
    try {
      updateUser({ id, values });
      setIsModalUpdateOpen(false);
      formUpdate.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  }

  const showDeleteConfirm = (record: any) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa thành viên này?',
      content: `Hành động này sẽ xóa vĩnh viễn tài khoản của ${record.name}.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        deleteUser(record._id);
      },
    });
  };
    
  const columns = [
    {
      title: "HỌ TÊN",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-blue-500">{text?.split(" ").pop()?.[0]}</Avatar>
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    { title: "EMAIL", dataIndex: "email", key: "email" },
    {
      title: "VAI TRÒ",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "blue" : "orange"}>{role}</Tag>
      ),
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (isVerified: boolean) => (
        <Tag color={isVerified ? "green" : "default"}>
          {isVerified ? "Hoạt động" : "Chưa xác thực"}
        </Tag>
      ),
    },
    {
      title: "THAO TÁC",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Edit
            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-blue-500" 
            onClick={() => {
              setSelectedUser(record);
              setIsModalUpdateOpen(true);
            }}
          />
          <Trash2 
            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500" 
            onClick={() => showDeleteConfirm(record)} 
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="Thành viên" 
      description="Quản lý quyền truy cập, vai trò và trạng thái."
      actions={
        <div className="flex gap-3">
          <Button icon={<Download size={16} />}>Xuất dữ liệu</Button>
          <Button 
            type="primary" 
            icon={<Plus size={16} />}
            onClick={() => setIsModalOpen(true)}
          >
            Thêm mới
          </Button>
        </div>
      }
    >
      <div className="flex gap-4 mb-6">
        <Input 
          prefix={<Search size={16} className="text-gray-400" />} 
          placeholder="Tìm kiếm theo tên, email..." 
          className="max-w-md"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select 
          value={role} 
          className="w-40" 
          onChange={(val) => {
              setRole(val);
              setPage(1);
          }}
        >
          <Select.Option value="all">Tất cả vai trò</Select.Option>
          <Select.Option value="admin">Quản trị viên</Select.Option>
          <Select.Option value="shipper">Shipper</Select.Option>
        </Select>
      </div>

      <Table 
        columns={columns} 
        dataSource={data?.data || []} 
        rowKey="_id"
        loading={isLoading}
        pagination={{ 
          current: page,
          pageSize: 10,
          total: data?.meta.total || 0,
          onChange: (p) => setPage(p)
        }} 
      />

      <AddUserModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleCreateUser={handleCreateUser} form={form}/>
      <UpdateUserDataModal isModalOpen={isModalUpdateOpen} setIsModalOpen={setIsModalUpdateOpen} handleUpdateUser={handleUpdateUser} form={formUpdate} user={selectedUser}/>
    </PageContainer>
  );
};

export default AccountManage;