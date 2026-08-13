import { useEffect, useState } from 'react';
import { Table, Input, Button, Tabs, Tag, Space, Typography, Modal, List, message, Empty, Badge } from 'antd';
import { SearchOutlined, DownloadOutlined, PlusOutlined, EyeOutlined, UserAddOutlined } from '@ant-design/icons';
import useGetAllOrderAdmin from '../hooks/useGetAllOrderAdmin';
import useGetAdminsAndShippers from "../../account_manage/hooks/useGetUsersAdmin";
import useAssignOrder from '../hooks/useAssignOrder';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../../../context/SocketContext';
import useProcessCancel from '../hooks/useProcessCancel';
import useReassignOrder from '../hooks/useReassignOrder';
import { Download, Plus } from 'lucide-react';
import PageContainer from '../../../components/ui/PageContainer';
import { formatVND } from '../../../utils/helper';

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
  const [assignmentMode, setAssignmentMode] = useState<"assign" | "reassign">("assign");
  const [reassignmentReason, setReassignmentReason] = useState("");

  const { data, isPending } = useGetAllOrderAdmin({ page, limit, status });
  const { data: shipperData, isLoading, refetch: refetchShippers } = useGetAdminsAndShippers({
    page: 1,
    limit: 100,
    role: "shipper", 
    search: "",
    availability: "online",
    orderId: selectedOrder?._id,
  });

  const { mutate: assignOrder } = useAssignOrder()
  const reassignOrder = useReassignOrder();

  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-orders-admin"] });
    };
    const handleShipperAvailability = () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    };
    socket.on("admin_refresh_orders", handleRefresh);
    socket.on("order_updated", handleRefresh);
    socket.on("shipper_availability_changed", handleShipperAvailability);
    return () => {
      socket.off("admin_refresh_orders", handleRefresh);
      socket.off("order_updated", handleRefresh);
      socket.off("shipper_availability_changed", handleShipperAvailability);
    };
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
    setAssignmentMode("assign");
    setReassignmentReason("");
    setIsAssignOpen(true);
    refetchShippers();
  };

  const handleOpenReassign = (record: any) => {
    setSelectedOrder(record);
    setAssignmentMode("reassign");
    setReassignmentReason("");
    setIsAssignOpen(true);
    refetchShippers();
  };

  const handleAssignConfirm = (shipperId: string) => {
    if (assignmentMode === "reassign") {
      if (reassignmentReason.trim().length < 5) {
        message.warning("Vui lòng nhập lý do đổi shipper tối thiểu 5 ký tự");
        return;
      }
      reassignOrder.mutate(
        { orderId: selectedOrder._id, shipperId, reason: reassignmentReason.trim() },
        { onSuccess: () => setIsAssignOpen(false) },
      );
      return;
    }
    assignOrder(
      { orderId: selectedOrder._id, shipperId },
      { onSuccess: () => setIsAssignOpen(false) },
    );
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
          {['assigned', 'confirmed'].includes(record.status) && (
            <Button icon={<UserAddOutlined />} onClick={() => handleOpenReassign(record)}>Đổi Shipper</Button>
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

  const getItemImage = (image?: string | string[]) => {
    if (Array.isArray(image)) return image[0] || "";
    return image || "";
  };

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
        width={880}
      >
        {selectedOrder && (
          <div className="space-y-5 text-slate-700">
            <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
              <div><p className="text-xs text-slate-500">Mã đơn</p><p className="font-bold text-blue-600">#VN-{selectedOrder._id.slice(-5).toUpperCase()}</p></div>
              <div><p className="text-xs text-slate-500">Ngày đặt</p><p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p></div>
              <div><p className="text-xs text-slate-500">Trạng thái</p><Tag color={selectedOrder.status === 'delivered' ? 'green' : selectedOrder.status === 'cancelled' ? 'red' : 'blue'}>{getStatus(selectedOrder.status)}</Tag></div>
              <div><p className="text-xs text-slate-500">Khách hàng</p><p className="font-semibold">{selectedOrder.userId?.name || selectedOrder.address?.name}</p></div>
              <div><p className="text-xs text-slate-500">Số điện thoại</p><p className="font-semibold">{selectedOrder.address?.phone || 'Chưa có'}</p></div>
              <div><p className="text-xs text-slate-500">Thanh toán</p><p className="font-semibold uppercase">{selectedOrder.paymentMethod || 'cod'} · {selectedOrder.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p></div>
              <div className="sm:col-span-2 lg:col-span-3"><p className="text-xs text-slate-500">Địa chỉ giao hàng</p><p className="font-semibold">{selectedOrder.address?.address || 'Chưa có'}</p></div>
              <div><p className="text-xs text-slate-500">Shipper</p><p className="font-semibold">{selectedOrder.shipperInfo?.name || 'Chưa phân công'}</p></div>
              <div><p className="text-xs text-slate-500">SĐT shipper</p><p className="font-semibold">{selectedOrder.shipperInfo?.phone || '—'}</p></div>
            </div>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Sản phẩm trong đơn</h3>
                <Badge count={selectedOrder.items?.length || 0} showZero color="#2563eb" />
              </div>
              {selectedOrder.items?.length ? (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  {selectedOrder.items.map((item: any) => {
                    const image = getItemImage(item.productImage);
                    return (
                      <div key={item._id} className="flex gap-3 border-b border-slate-100 p-3 last:border-b-0">
                        {image ? <img src={image} alt={item.productName} className="h-16 w-16 shrink-0 rounded-lg border object-cover" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">Không ảnh</div>}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900">{item.productName}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.itemType === 'Special' ? 'Sản phẩm đặc biệt' : 'Sản phẩm'}{item.productUnit ? ` · ${item.productUnit}` : ''}</p>
                          {item.salePercent > 0 && <Tag color="red" className="mt-1">Giảm {item.salePercent}%</Tag>}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">{formatVND(item.price)} × {item.quantity}</p>
                          <p className="mt-1 font-bold text-slate-900">{formatVND(item.price * item.quantity)}</p>
                          {item.originalPrice > item.price && <p className="text-xs text-slate-400 line-through">{formatVND(item.originalPrice)}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Đơn hàng chưa có dữ liệu sản phẩm" />}
            </section>

            <div className="ml-auto w-full space-y-2 rounded-xl bg-orange-50 p-4 sm:w-96">
              <div className="flex justify-between"><span>Tạm tính</span><strong>{formatVND(selectedOrder.subTotal || 0)}</strong></div>
              <div className="flex justify-between"><span>Phí vận chuyển</span><strong>{formatVND(selectedOrder.shippingFee || 0)}</strong></div>
              <div className="flex justify-between text-emerald-700"><span>Giảm giá{selectedOrder.couponCode ? ` (${selectedOrder.couponCode})` : ''}</span><strong>-{formatVND(selectedOrder.couponDiscount || 0)}</strong></div>
              <div className="flex justify-between border-t border-orange-200 pt-2 text-lg text-orange-700"><span className="font-bold">Tổng cộng</span><strong>{formatVND(selectedOrder.totalPrice || 0)}</strong></div>
            </div>
          </div>
        )}
      </Modal>

      <Modal 
        title="Chọn Shipper" 
        open={isAssignOpen} 
        onCancel={() => setIsAssignOpen(false)} 
        footer={null}
      >
        {assignmentMode === "reassign" && (
          <Input.TextArea
            className="mb-4"
            rows={3}
            value={reassignmentReason}
            onChange={(event) => setReassignmentReason(event.target.value)}
            placeholder="Lý do đổi shipper..."
          />
        )}
        <List
          itemLayout="horizontal"
          dataSource={shipperData?.data || []}
          loading={isLoading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Hiện chưa có shipper nào trực tuyến"
              >
                <Button onClick={() => refetchShippers()}>Làm mới danh sách</Button>
              </Empty>
            ),
          }}
          renderItem={(item) => (
            <List.Item
              actions={[<Button onClick={() => handleAssignConfirm(item._id)}>Chọn</Button>]}
            >
              <List.Item.Meta
                title={<span className="flex items-center gap-2"><Badge status="success" />{item.name}</span>}
                description={`${item.phone || item.email}${item.distanceKm != null ? ` · Cách khoảng ${item.distanceKm} km` : ""} · Đang xử lý ${item.activeOrderCount || 0}/${item.maxActiveOrders || 5} đơn`}
              />
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
