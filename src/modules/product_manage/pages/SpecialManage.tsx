import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Table, Input, Button, Tabs, Tag, Space, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined, FilterOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllSpecials from '../hooks/useGetAllSpecials';
import useDeleteProduct from '../hooks/useDeleteProduct';

const SpecialManage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('all');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: allProducts, isPending } = useGetAllSpecials({ page, limit, status })
  const { deleteProduct, isDeleting } = useDeleteProduct();
  
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  const handleTabChange = (key: string) => {
    setStatus(key);
    setPage(1);
  };

  const handleDeleteConfirm = () => {
    if (selectedProduct?._id ) {
      deleteProduct(selectedProduct._id , {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSelectedProduct(null);
        },
      });
    }
  };

  const columns = [
    {
      title: 'TÊN SẢN PHẨM',
      key: 'name',
      render: (record: any) => (
        <div className="font-semibold text-gray-800">{record.name}</div>
      ),
    },
    { title: 'NGUỒN GỐC', dataIndex: "origin", key: 'origin', render: (origin: string) => <div className="font-semibold text-gray-800">{origin}</div> },
    {
      title: 'GIÁ BÁN',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()}đ`,
    },
    { title: 'KHO', dataIndex: 'stock', key: 'stock' },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => {
        if (stock > 0) return <Tag color="green">CÒN HÀNG</Tag>;
        if (stock == 0) return <Tag color="orange">HẾT HÀNG</Tag>;
        return (
          <div>{stock}</div>
        )
      },
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" onClick={() => navigate(`/manage/specials/edit/${record._id}`)}>Sửa</Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => { setSelectedProduct(record); setIsDeleteOpen(true); }} 
          />
        </Space>
      ),
    },
  ];

  const items = [
    { key: 'all', label: 'Tất cả' },
    { key: 'in_stock', label: 'Còn hàng' },
    { key: 'out_of_stock', label: 'Hết hàng' },
  ];

  return (
    <PageContainer
      title="Danh sách sản phẩm"
      description="Quản lý kho hàng và thông tin sản phẩm."
      actions={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large" 
          onClick={() => navigate('/manage/products/add')}
        >
          Thêm sản phẩm
        </Button>
      }
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <Input placeholder="Tìm kiếm tên, SKU..." prefix={<SearchOutlined />} className="w-64" />
          <Button icon={<FilterOutlined />}>Lọc thêm</Button>
        </div>
        <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
      </div>

      <Tabs defaultActiveKey="all" items={items} onChange={handleTabChange} />
      <Table 
        columns={columns} 
        dataSource={allProducts?.data} 
        rowKey="key"
        pagination={{
          current: page,
          pageSize: limit,
          total: allProducts?.meta?.total || 0,
        }}
        onChange={handleTableChange}
      />

      <Modal 
        title="Xác nhận xóa" 
        open={isDeleteOpen} 
        onCancel={() => setIsDeleteOpen(false)} 
        onOk={handleDeleteConfirm}
        okText="Xóa"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>{selectedProduct?.name}</strong> không?</p>
      </Modal>
    </PageContainer>
  );
};

export default SpecialManage;