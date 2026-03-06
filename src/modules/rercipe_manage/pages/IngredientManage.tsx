import { useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllIngredients from '../hooks/useGetAllIngredient';
import useCreateIngredient from '../hooks/useCreateIngredient';
import useUpdateIngredient from '../hooks/useUpdateIngredient';
import useDeleteIngredient from '../hooks/useDeleteIngredient';
import type { IngredientResponse } from '../types/api-response';

const IngredientManage = () => {
  const [form] = Form.useForm();
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const { data, isPending } = useGetAllIngredients({ 
    search, 
    page, 
    limit: pageSize 
  });

  const { createIngredient, isCreating } = useCreateIngredient();
  const { updateIngredient, isUpdating } = useUpdateIngredient();
  const { deleteIngredient, isDeleting } = useDeleteIngredient();

  const handleOpenModal = (record?: IngredientResponse) => {
    if (record) {
      setEditingItem(record);
      form.setFieldsValue(record);
    } else {
      setEditingItem(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const onFinish = (values: any) => {
    if (editingItem) {
      updateIngredient(
        { id: editingItem._id, data: values },
        {
          onSuccess: () => setIsModalOpen(false),
        }
      );
    } else {
      createIngredient(values, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa?',
      content: 'Nguyên liệu này có thể đang được dùng trong các công thức nấu ăn. Bạn vẫn muốn tiếp tục?',
      okText: 'Xóa',
      okButtonProps: { danger: true, loading: isDeleting },
      onOk: () => deleteIngredient(id),
    });
  };

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); 
  };

  const columns = [
    { 
      title: 'TÊN NGUYÊN LIỆU', 
      dataIndex: 'customName', 
      key: 'name', 
      render: (text: string) => <b>{text}</b> 
    },
    { 
      title: 'ĐƠN VỊ', 
      dataIndex: 'unit', 
      key: 'unit' 
    },
    { 
      title: 'GIÁ ƯỚC TÍNH', 
      dataIndex: 'price', 
      key: 'price', 
      render: (val: number) => `${val?.toLocaleString() || 0}đ` 
    },
    { 
      title: 'NGƯỜI TẠO', 
      dataIndex: ['creatorId', 'name'], 
      key: 'creator', 
      render: (name: string) => name || 'Hệ thống' 
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      render: (_: any, record: IngredientResponse) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleOpenModal(record)} 
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record._id)} 
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer 
      title="Kho nguyên liệu tùy chỉnh" 
      description="Quản lý các loại gia vị, thực phẩm bổ trợ không nằm trong danh mục sản phẩm."
      actions={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => handleOpenModal()}
        >
          Thêm nguyên liệu
        </Button>
      }
    >
      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm nguyên liệu..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          allowClear
          onChange={handleSearch}
        />
      </div>

      <Table 
        dataSource={data?.data} 
        columns={columns} 
        loading={isPending} 
        rowKey="_id"
        onChange={handleTableChange}
        pagination={{
            current: page,
            pageSize: pageSize,
            total: data?.meta?.total || 0,
        }}
      />

      <Modal
        title={editingItem ? "Cập nhật nguyên liệu" : "Thêm nguyên liệu mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating || isUpdating}
        maskClosable={false}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish} 
          className="mt-4"
        >
          <Form.Item 
            name="customName" 
            label="Tên nguyên liệu" 
            rules={[{ required: true, message: 'Vui lòng nhập tên nguyên liệu' }]}
          >
            <Input placeholder="Vd: Muối hầm, Hành lá..." />
          </Form.Item>
          
          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="unit" 
              label="Đơn vị tính" 
              rules={[{ required: true, message: 'Vui lòng nhập đơn vị' }]}
            >
              <Input placeholder="Vd: kg, gram, bó..." />
            </Form.Item>
            
            <Form.Item 
              name="price" 
              label="Giá nhập ước tính"
            >
              <InputNumber 
                className="w-full" 
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value: any) => {
                    const parsed = parseFloat(value.replace(/\$\s?|(,*)/g, ''));
                    return isNaN(parsed) ? 0 : parsed;
                }}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default IngredientManage;