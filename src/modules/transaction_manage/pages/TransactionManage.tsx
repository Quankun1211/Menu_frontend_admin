import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Select, Space, Table, Tag, Tooltip, message } from "antd";
import dayjs from "dayjs";
import PageContainer from "../../../components/ui/PageContainer";
import { getTransactionsApi, retryRefundApi, type AdminTransaction } from "../services/api";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

const TransactionManage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const { data, isPending } = useQuery({
    queryKey: ["admin-transactions", page, status, paymentMethod],
    queryFn: () => getTransactionsApi({ page, limit: 20, status, paymentMethod }),
  });
  const retry = useMutation({
    mutationFn: retryRefundApi,
    onSuccess: () => {
      message.success("Đã xử lý lại yêu cầu hoàn tiền");
      queryClient.invalidateQueries({ queryKey: ["admin-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-orders-admin"] });
    },
    onError: (error: any) => message.error(error?.message || "Thử hoàn tiền thất bại"),
  });

  return (
    <PageContainer
      title="Giao dịch và hoàn tiền"
      description="Theo dõi thanh toán, đối soát và xử lý các yêu cầu hoàn tiền lỗi."
      actions={
        <Space wrap>
          <Select value={paymentMethod} onChange={(value) => { setPaymentMethod(value); setPage(1); }} options={[
            { value: "all", label: "Mọi phương thức" },
            { value: "cod", label: "COD" },
            { value: "vnpay", label: "VNPay" },
          ]} />
          <Select value={status} onChange={(value) => { setStatus(value); setPage(1); }} options={[
            { value: "all", label: "Mọi trạng thái" },
            { value: "pending", label: "Chờ xử lý" },
            { value: "completed", label: "Hoàn tất" },
            { value: "failed", label: "Thất bại" },
            { value: "refunded", label: "Đã hoàn tiền" },
          ]} />
        </Space>
      }
    >
      <Table<AdminTransaction>
        rowKey="_id"
        loading={isPending}
        dataSource={data?.data || []}
        scroll={{ x: 1000 }}
        pagination={{ current: page, pageSize: 20, total: data?.meta?.total || 0, onChange: setPage }}
        columns={[
          { title: "Mã giao dịch", dataIndex: "_id", render: (id) => <span className="font-mono">#{id.slice(-8).toUpperCase()}</span> },
          { title: "Khách hàng", render: (_, row) => <div><p className="font-medium">{row.userId?.name || "Khách hàng"}</p><p className="text-xs text-slate-400">{row.userId?.email}</p></div> },
          { title: "Phương thức", dataIndex: "paymentMethod", render: (value) => <Tag>{String(value).toUpperCase()}</Tag> },
          { title: "Số tiền", dataIndex: "amount", render: (value) => <strong>{money.format(value)}</strong> },
          { title: "Trạng thái", dataIndex: "status", render: (value) => <Tag color={value === "completed" ? "green" : value === "failed" ? "red" : value === "refunded" ? "purple" : "orange"}>{value}</Tag> },
          { title: "Thời gian", dataIndex: "createdAt", render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm") },
          {
            title: "Hoàn tiền",
            render: (_, row) => {
              const failedRefund = row.orderId?.refundStatus === "failed";
              return (
                <Space>
                  {row.refundRetryCount > 0 && <Tooltip title={row.lastRefundError}><Tag color="orange">Đã thử {row.refundRetryCount}/5</Tag></Tooltip>}
                  {failedRefund && (
                    <Button
                      size="small"
                      type="primary"
                      danger
                      loading={retry.isPending}
                      onClick={() => retry.mutate(row.orderId!._id)}
                    >
                      Thử hoàn tiền
                    </Button>
                  )}
                </Space>
              );
            },
          },
        ]}
      />
    </PageContainer>
  );
};

export default TransactionManage;
