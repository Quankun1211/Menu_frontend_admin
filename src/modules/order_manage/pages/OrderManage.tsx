import { useEffect, useState } from 'react';
import { Table, Input, Button, Tabs, Tag, Space, Typography, Modal, List, message } from 'antd';
import { SearchOutlined, DownloadOutlined, PlusOutlined, EyeOutlined, UserAddOutlined } from '@ant-design/icons';
import useGetAllOrderAdmin from '../hooks/useGetAllOrderAdmin';
import useGetAdminsAndShippers from "../../account_manage/hooks/useGetUsersAdmin";
import useAssignOrder from '../hooks/useAssignOrder';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../../../context/SocketContext';
import useProcessCancel from '../hooks/useProcessCancel';
import { Download, Plus } from 'lucide-react';
import PageContainer from '../../../components/ui/PageContainer';

const { Title } = Typography;

const OrderManage = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('all');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data, isPending } = useGetAllOrderAdmin({ page, limit, status });
  const { data: shipperData, isLoading } = useGetAdminsAndShippers({ 
    page, 
    limit: 10, 
    role: "shipper", 
    search: "" 
  });

  const { mutate: assignOrder } = useAssignOrder()

  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ["admin_orders_list"] });
    };
    socket.on("admin_refresh_orders", handleRefresh);
    return () => { socket.off("admin_refresh_orders", handleRefresh); };
  }, [socket, queryClient]);

  const [isCancelProcessOpen, setIsCancelProcessOpen] = useState(false);

  const { mutate: processCancel } = useProcessCancel()

  const handleProcessCancel = async (action: 'accept' | 'reject') => {
    try {
      processCancel({ values: {orderId: selectedOrder._id, action}})
      setIsCancelProcessOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get-all-orders-admin"] });
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  const handleOpenDetail = (record: any) => {
    setSelectedOrder(record);
    setIsDetailOpen(true);
  };

  const handleOpenAssign = (record: any) => {
    setSelectedOrder(record);
    setIsAssignOpen(true);
  };

  const handleAssignConfirm = (shipperId: string) => {
    assignOrder({orderId: selectedOrder._id, shipperId})
    setIsAssignOpen(false);
  };

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  const handleTabChange = (key: string) => {
    setStatus(key);
    setPage(1);
  };

  const columns = [
    {
      title: 'MÃ ĐƠN HÀNG',
      dataIndex: "_id",
      key: '_id',
      render: (id: string) => (
        <span className="font-semibold text-blue-600">
          #VN-{id?.slice(-5).toUpperCase()}
        </span>
      ),
    },
    {
      title: 'KHÁCH HÀNG',
      dataIndex: ['userId', 'name'],
      key: 'userId',
      render: (name: string) => (
        <span className="font-semibold text-gray-700">
          {name}
        </span>
      ),
    },
    {
      title: 'ĐỊA CHỈ',
      dataIndex: ['address', 'address'],
      key: 'address',
      render: (address: string) => (
        <span className="font-semibold text-gray-700">
          {address}
        </span>
      ),
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let text = "";
        if (status === 'delivered') {color = 'green'; text = "Đã giao"};
        if (status === 'shipping') {color = 'blue'; text = "Đang giao"};
        if (status === 'assigned') {color = 'orange'; text = "Chờ shipper xác nhận"};
        if (status === 'confirmed') {color = 'orange'; text = "Chờ shipper lấy hàng"};
        if (status === 'pending') {color = 'orange'; text = "Chờ xác nhận"};
        if (status === 'pending_cancel') {color = 'yellow'; text = "Shipper yêu cầu hủy"};
        if (status === 'cancelled') {color = 'red'; text = "Đã hủy"};
        return <Tag color={color}>{text.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleOpenDetail(record)}>Chi tiết</Button>
          {record.status === 'pending' && (
            <Button type="primary" ghost icon={<UserAddOutlined />} onClick={() => handleOpenAssign(record)}>Gán Shipper</Button>
          )}
          {record.status === 'pending_cancel' && (
            <Button danger type="primary" onClick={() => { setSelectedOrder(record); setIsCancelProcessOpen(true); }}>
              Xử lý hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const getStatus = (status: string) => {
    let text = ""
    if (status === 'delivered') { text = "Đã giao"};
    if (status === 'shipping') { text = "Đang giao"};
    if (status === 'pending') { text = "Chờ xác nhận"};
    if (status === 'confirmed') { text = "Chờ shipper lấy hàng"};
    if (status === 'assigned') { text = "Chờ shipper xác nhận"};
    if (status === 'pending_cancel') { text = "Shipper yêu cầu hủy"};
    if (status === 'cancelled') { text = "Đã hủy"};
    return text
  }

  const items = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'delivered', label: 'Đã giao' },
    { key: 'cancelled', label: 'Đã hủy' },
  ];

  return (
    <PageContainer
      title="Danh sách đơn hàng" 
      description="Quản lý và theo dõi toàn bộ trạng thái đơn hàng."
      actions={
        <Button type="primary" icon={<Plus size={16} />}>Tạo đơn mới</Button>
      }
    >

      <div className="flex justify-between items-center mb-4">
        <Input 
          placeholder="Tìm kiếm..." 
          prefix={<SearchOutlined />} 
          className="w-96"
        />
        <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
      </div>

      <Tabs 
        defaultActiveKey="all" 
        items={items} 
        onChange={handleTabChange} 
      />

      <Table 
        columns={columns} 
        dataSource={data?.data || []} 
        loading={isPending}
        rowKey="_id"
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.meta?.total || 0,
        }}
        onChange={handleTableChange}
      />

      <Modal 
        title="Chi tiết đơn hàng" 
        open={isDetailOpen} 
        onCancel={() => setIsDetailOpen(false)} 
        footer={null}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <p><strong>Mã đơn:</strong> #VN-{selectedOrder._id.slice(-5).toUpperCase()}</p>
            <p><strong>Khách hàng:</strong> {selectedOrder.userId?.name}</p>
            <p><strong>Số điện thoại:</strong> {selectedOrder.address?.phone}</p>
            <p><strong>Tổng tiền:</strong> {selectedOrder.totalPrice?.toLocaleString()}đ</p>
            <p><strong>Trạng thái:</strong> {getStatus(selectedOrder.status)}</p>
            <p><strong>Địa chỉ:</strong> {selectedOrder.address?.address}</p>
            <p><strong>Shipper:</strong> {selectedOrder.shipperInfo?.name || "Chưa có"}</p>
            <p><strong>SĐT Shipper:</strong> {selectedOrder.shipperInfo?.phone || "Chưa có"}</p>
          </div>
        )}
      </Modal>

      <Modal 
        title="Chọn Shipper" 
        open={isAssignOpen} 
        onCancel={() => setIsAssignOpen(false)} 
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={shipperData?.data || []}
          renderItem={(item) => (
            <List.Item
              actions={[<Button onClick={() => handleAssignConfirm(item._id)}>Chọn</Button>]}
            >
              <List.Item.Meta title={item.name} />
            </List.Item>
          )}
        />
      </Modal>

      <Modal 
        title="Xử lý yêu cầu hủy đơn" 
        open={isCancelProcessOpen} 
        onCancel={() => setIsCancelProcessOpen(false)} 
        footer={[
          <Button key="reject" onClick={() => handleProcessCancel('reject')}>Từ chối hủy</Button>,
          <Button key="accept" type="primary" danger onClick={() => handleProcessCancel('accept')}>Chấp nhận hủy</Button>
        ]}
      >
        {selectedOrder && (
          <div className="space-y-3">
            <p><strong>Mã đơn:</strong> #VN-{selectedOrder._id.slice(-5).toUpperCase()}</p>
            <p><strong>Lý do hủy từ Shipper:</strong></p>
            <div className="p-3 bg-gray-50 rounded border">
              {selectedOrder.cancelRequest?.reason || "Không có lý do cụ thể"}
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>

  );
};

export default OrderManage;