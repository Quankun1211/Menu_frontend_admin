import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Table, Input, Button, Tabs, Tag, Space, Modal, message } from 'antd';
import { FilterOutlined, DeleteOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { Search } from 'lucide-react';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllProducts from '../hooks/useGetAllProducts';
import useDeleteProduct from '../hooks/useDeleteProduct'; // Import hook của bạn

const ProductManage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('all');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: allProducts, isPending } = useGetAllProducts({ page, limit, status, search: debouncedSearch });
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
      title: 'STT',
      key: 'index',
      width: 70,
      render: (_: any, __: any, index: number) => (
        <div className="font-semibold text-gray-800">
          {(page - 1) * limit + index + 1}
        </div>
      ),
    },
    {
      title: 'TÊN SẢN PHẨM',
      key: 'name',
      render: (record: any) => (
        <div className="font-semibold text-gray-800">{record.name}</div>
      ),
    },
    { 
      title: 'DANH MỤC', 
      dataIndex: ['categoryId', 'name'], 
      key: 'category', 
      render: (cat: string) => <div className="font-semibold text-gray-800">{cat || 'N/A'}</div> 
    },
    {
      title: 'GIÁ BÁN',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price?.toLocaleString()}đ`,
    },
    { title: 'KHO', dataIndex: 'stock', key: 'stock' },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'stock',
      key: 'status',
      render: (stock: number) => {
        if (stock > 0) return <Tag color="green">CÒN HÀNG</Tag>;
        return <Tag color="orange">HẾT HÀNG</Tag>;
      },
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => navigate(`/manage/products/edit/${record._id || record.key}`)}
          >
            Sửa
          </Button>
          
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => { 
                setSelectedProduct(record); 
                setIsDeleteOpen(true); 
            }} 
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
      description="Quản lý kho hàng và thông tin sản phẩm trực tuyến."
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
          <Input 
            prefix={<Search size={16} className="text-gray-400" />} 
            placeholder="Tìm kiếm theo tên sản phẩm..." 
            className="w-80"
            allowClear
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button icon={<FilterOutlined />}>Lọc thêm</Button>
        </div>
        <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
      </div>

      <Tabs activeKey={status} items={items} onChange={handleTabChange} />

      <Table 
        columns={columns} 
        dataSource={allProducts?.data} 
        rowKey={(record) => record._id || record.key}
        loading={isPending}
        pagination={{
          current: page,
          pageSize: limit,
          total: allProducts?.meta?.total || 0,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50']
        }}
        onChange={handleTableChange}
      />

      <Modal 
        title="Xác nhận xóa sản phẩm" 
        open={isDeleteOpen} 
        onCancel={() => {
          if (!isDeleting) setIsDeleteOpen(false);
        }} 
        onOk={handleDeleteConfirm}
        okText="Xóa ngay"
        cancelText="Hủy"
        confirmLoading={isDeleting} 
        okButtonProps={{ danger: true }}
      >
        <p>Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa sản phẩm:</p>
        <p className="mt-2 font-bold text-red-600 text-lg">
          {selectedProduct?.name}
        </p>
      </Modal>
    </PageContainer>
  );
};

export default ProductManage;