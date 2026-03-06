import { useState, useEffect } from 'react';
import { Table, Input, Button, Tabs, Space, Modal, Form, Upload, message, Popconfirm } from 'antd';
import { SearchOutlined, DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllCategory from '../hooks/useGetAllCategory';
import useCreateCategory from '../hooks/useCreateCategory';
import useUpdateCategoryData from '../hooks/useUpdateCategory';
import useDeleteCategory from '../hooks/useDeleteCategory';

const { Dragger } = Upload;

const CategoryManage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState('product'); 

  const { data: allCategory, isPending } = useGetAllCategory({ 
    page, 
    limit, 
    type: status, 
  });

  const { createCategory, isCreating } = useCreateCategory();
  const { mutate: updateCategory, isUpdating } = useUpdateCategoryData();
  const { deleteCategory, isDeleting } = useDeleteCategory();

  const handleTabChange = (key: string) => {
    setStatus(key);
    setPage(1);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setIsModalOpen(true);
    form.setFieldsValue({
      name: record.name,
      title: record.title,
      description: record.description,
    });
  };

  const handleFinish = (values: any) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('type', status); 

    if (values.title) formData.append('title', values.title);
    if (values.description) formData.append('description', values.description);

    if (values.image?.fileList?.[0]?.originFileObj) {
        formData.append('image', values.image.fileList[0].originFileObj);
    }

    if (editingRecord) {
        updateCategory({ id: editingRecord._id, formData }, {
            onSuccess: () => closeModal()
        });
    } else {
        createCategory(formData, {
            onSuccess: () => closeModal()
        });
    }
  };

  const columns = [
    ...(status === 'product' ? [{ 
      title: 'ẢNH', 
      dataIndex: 'image', 
      key: 'image', 
      width: 100,
      render: (img: string) => img ? <img src={img} alt="cat" className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400">No Img</div>
    }] : []),
    { title: 'TÊN DANH MỤC', dataIndex: 'name', key: 'name' },
    ...(status === 'menu' ? [{ title: 'TIÊU ĐỀ', dataIndex: 'title', key: 'title' }] : []),
    ...(status === 'menu' || status === 'recipe' ? [{ title: 'MÔ TẢ', dataIndex: 'description', key: 'description', ellipsis: true }] : []),
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          
          <Popconfirm
            title="Xác nhận xóa"
            description={
              <div>
                <p>Bạn có chắc chắn muốn xóa danh mục <strong>{record.name}</strong>?</p>
                <p className="text-xs text-red-500">* Hành động này có thể được khôi phục từ thùng rác.</p>
              </div>
            }
            onConfirm={() => deleteCategory({ id: record._id, type: status })}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: isDeleting }}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const items = [
    { key: 'product', label: 'Danh mục sản phẩm' },
    { key: 'menu', label: 'Danh mục thực đơn' },
    { key: 'recipe', label: 'Danh mục công thức' },
  ];

  return (
    <PageContainer
      title="Quản lý danh mục"
      description="Quản lý cấu trúc danh mục cho sản phẩm, thực đơn và công thức."
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Thêm danh mục
        </Button>
      }
    >
      <div className="flex justify-between items-center mb-4">
        <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
      </div>

      <Tabs activeKey={status} items={items} onChange={handleTabChange} />

      <Table 
        columns={columns} 
        dataSource={allCategory?.data || []} 
        loading={isPending}
        rowKey="_id"
        pagination={{
          current: page,
          pageSize: limit,
          total: allCategory?.meta?.total || 0,
          onChange: (p) => setPage(p)
        }}
      />

      <Modal 
        title={
          <div className="text-xl font-bold border-b pb-3 mb-2">
            {editingRecord ? 'Chỉnh sửa' : 'Thêm'} danh mục {status === 'product' ? 'sản phẩm' : status === 'menu' ? 'thực đơn' : 'công thức'}
          </div>
        }
        open={isModalOpen} 
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={editingRecord ? isUpdating : isCreating}
        destroyOnHidden
        centered
        width={status === 'product' ? 500 : 600}
        okText={editingRecord ? "Lưu thay đổi" : "Xác nhận tạo"}
        cancelText="Hủy bỏ"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4" requiredMark="optional">
          <div className="grid grid-cols-1 gap-1">
            <Form.Item 
              name="name" 
              label={<span className="font-semibold text-gray-700">Tên danh mục</span>}
              rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
            >
              <Input size="large" placeholder="Ví dụ: Rau củ tươi, Mâm cơm Tết..." />
            </Form.Item>

            {status === 'menu' && (
              <Form.Item 
                name="title" 
                label={<span className="font-semibold text-gray-700">Tiêu đề hiển thị</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
              >
                <Input size="large" placeholder="Nhập tiêu đề thu hút khách hàng..." />
              </Form.Item>
            )}
            
            {status === 'product' && (
              <Form.Item name="image" label={<span className="font-semibold text-gray-700">Hình ảnh đại diện</span>}>
                <Dragger maxCount={1} listType="picture" className="bg-gray-50 border-dashed border-2 rounded-xl py-6" beforeUpload={() => false}>
                  <p className="ant-upload-drag-icon"><InboxOutlined className="text-blue-500 text-4xl" /></p>
                  <p className="ant-upload-text font-medium">Tải ảnh mới (nếu muốn thay đổi)</p>
                </Dragger>
              </Form.Item>
            )}

            {(status === 'menu' || status === 'recipe') && (
              <Form.Item 
                name="description" 
                label={<span className="font-semibold text-gray-700">Mô tả chi tiết</span>}
                rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
              >
                <Input.TextArea rows={4} placeholder="Mô tả ngắn gọn..." showCount maxLength={200} />
              </Form.Item>
            )}
          </div>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default CategoryManage;