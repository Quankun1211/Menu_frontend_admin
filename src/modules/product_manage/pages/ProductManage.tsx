import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Table, Input, Button, Tabs, Tag, Space, Modal } from 'antd';
import { FilterOutlined, PoweroffOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { Search } from 'lucide-react';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllProducts from '../hooks/useGetAllProducts';
import useDeleteProduct from '../hooks/useDeleteProduct';
import useActivateProduct from '../hooks/useActiveProduct';

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

  const { data: allProducts, isPending } = useGetAllProducts({
    page,
    limit,
    status,
    search: debouncedSearch
  });

  const { deleteProduct, isDeleting } = useDeleteProduct();
  const { activeProduct, isActivating } = useActivateProduct();

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  const handleTabChange = (key: string) => {
    setStatus(key);
    setPage(1);
  };

  const handleStatusConfirm = () => {
    if (!selectedProduct?._id) return;

    if (selectedProduct.isActive === false) {
      activeProduct(selectedProduct._id, {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSelectedProduct(null);
        },
      });
      return;
    }

    deleteProduct(selectedProduct._id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setSelectedProduct(null);
      },
    });
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
        <div className="font-semibold text-gray-800">
          {record.name}
        </div>
      ),
    },
    {
      title: 'DANH MỤC',
      dataIndex: ['categoryId', 'name'],
      key: 'category',
      render: (cat: string) => (
        <div className="font-semibold text-gray-800">
          {cat || 'N/A'}
        </div>
      )
    },
    {
      title: 'GIÁ BÁN',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price?.toLocaleString()}đ`,
    },
    {
      title: 'KHO',
      dataIndex: 'stock',
      key: 'stock'
    },
    {
      title: 'TRẠNG THÁI',
      key: 'status',
      render: (record: any) => {
        if (record.isActive === false) {
          return <Tag color="red">NGƯNG HOẠT ĐỘNG</Tag>;
        }

        if (record.stock > 0) {
          return <Tag color="green">CÒN HÀNG</Tag>;
        }

        return <Tag color="orange">HẾT HÀNG</Tag>;
      },
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      render: (_: any, record: any) => {
        const isActive = record.isActive !== false;

        return (
          <Space size="middle">
            <Button
              type="link"
              onClick={() =>
                navigate(`/manage/products/edit/${record._id || record.key}`)
              }
            >
              Sửa
            </Button>

            <Button
              type="text"
              danger={isActive}
              icon={<PoweroffOutlined />}
              title={isActive ? "Vô hiệu hóa sản phẩm" : "Kích hoạt lại sản phẩm"}
              onClick={() => {
                setSelectedProduct(record);
                setIsDeleteOpen(true);
              }}
            >
              {isActive ? "Ẩn" : "Kích hoạt"}
            </Button>
          </Space>
        );
      },
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

          <Button icon={<FilterOutlined />}>
            Lọc thêm
          </Button>
        </div>

        <Button icon={<DownloadOutlined />}>
          Xuất Excel
        </Button>
      </div>

      <Tabs
        activeKey={status}
        items={items}
        onChange={handleTabChange}
      />

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
        title={
          selectedProduct?.isActive === false
            ? "Xác nhận kích hoạt sản phẩm"
            : "Xác nhận ẩn sản phẩm"
        }
        open={isDeleteOpen}
        onCancel={() => {
          if (!isDeleting && !isActivating) {
            setIsDeleteOpen(false);
          }
        }}
        onOk={handleStatusConfirm}
        okText={
          selectedProduct?.isActive === false
            ? "Kích hoạt"
            : "Ẩn sản phẩm"
        }
        cancelText="Hủy"
        confirmLoading={isDeleting || isActivating}
        okButtonProps={{
          danger: selectedProduct?.isActive !== false
        }}
      >
        {selectedProduct?.isActive === false ? (
          <>
            <p>
              Sản phẩm này đang ở trạng thái ngưng hoạt động.
              Bạn có muốn kích hoạt lại không?
            </p>

            <p className="mt-2 font-bold text-green-600 text-lg">
              {selectedProduct?.name}
            </p>
          </>
        ) : (
          <>
            <p>
              Sản phẩm sẽ được chuyển sang trạng thái ngưng hoạt động
              và không hiển thị cho khách hàng.
            </p>

            <p className="mt-2 font-bold text-red-600 text-lg">
              {selectedProduct?.name}
            </p>
          </>
        )}
      </Modal>
    </PageContainer>
  );
};

export default ProductManage;