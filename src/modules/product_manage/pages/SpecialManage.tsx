import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Table, Input, Button, Tabs, Tag, Space, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, FilterOutlined, PoweroffOutlined, DownloadOutlined } from '@ant-design/icons';
import PageContainer from '../../../components/ui/PageContainer';
import useGetAllSpecials from '../hooks/useGetAllSpecials';
import useDeleteSpecial from '../hooks/useDeleteSpecial';
import useActivateSpecial from '../hooks/useActiveSpecial';

const SpecialManage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('all');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: allProducts, isPending } = useGetAllSpecials({ page, limit, status });
  const { deleteSpecial, isDeleting } = useDeleteSpecial();
  const { activeSpecial, isActivating } = useActivateSpecial();

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
      activeSpecial(selectedProduct._id, {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSelectedProduct(null);
        },
      });
      return;
    }

    deleteSpecial(selectedProduct._id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setSelectedProduct(null);
      },
    });
  };

  const columns = [
    {
      title: 'TÊN SẢN PHẨM',
      key: 'name',
      render: (record: any) => (
        <div className="font-semibold text-gray-800">{record.name}</div>
      ),
    },
    {
      title: 'NGUỒN GỐC',
      dataIndex: "origin",
      key: 'origin',
      render: (origin: string) => (
        <div className="font-semibold text-gray-800">{origin}</div>
      )
    },
    {
      title: 'GIÁ BÁN',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()}đ`,
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
              type="text"
              onClick={() => navigate(`/manage/specials/edit/${record._id}`)}
            >
              Sửa
            </Button>

            <Button
              type="text"
              danger={isActive}
              icon={<PoweroffOutlined />}
              onClick={() => {
                setSelectedProduct(record);
                setIsDeleteOpen(true);
              }}
            >
              {isActive ? 'Ẩn' : 'Kích hoạt'}
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
          <Input
            placeholder="Tìm kiếm tên, SKU..."
            prefix={<SearchOutlined />}
            className="w-64"
          />
          <Button icon={<FilterOutlined />}>Lọc thêm</Button>
        </div>

        <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
      </div>

      <Tabs
        activeKey={status}
        items={items}
        onChange={handleTabChange}
      />

      <Table
        columns={columns}
        dataSource={allProducts?.data}
        rowKey={(record) => record._id}
        loading={isPending}
        pagination={{
          current: page,
          pageSize: limit,
          total: allProducts?.meta?.total || 0,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={
          selectedProduct?.isActive === false
            ? "Xác nhận kích hoạt đặc sản"
            : "Xác nhận ẩn đặc sản"
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
            : "Ẩn đặc sản"
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
              Đặc sản này hiện đang ngưng kinh doanh.
              Bạn có muốn kích hoạt lại không?
            </p>

            <p className="mt-2 font-bold text-green-600 text-lg">
              {selectedProduct?.name}
            </p>
          </>
        ) : (
          <>
            <p>
              Đặc sản sẽ được chuyển sang trạng thái ngưng hoạt động
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

export default SpecialManage;