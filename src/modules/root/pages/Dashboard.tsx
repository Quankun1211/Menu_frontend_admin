import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  InboxOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Alert, Button, Select, Skeleton, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { useDashboard } from "../hooks/useDashboard";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
const number = new Intl.NumberFormat("vi-VN");

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xử lý", color: "gold" },
  assigned: { label: "Đã phân công", color: "blue" },
  confirmed: { label: "Đã xác nhận", color: "cyan" },
  processing: { label: "Đang chuẩn bị", color: "geekblue" },
  shipping: { label: "Đang giao", color: "purple" },
  delivered: { label: "Đã giao", color: "green" },
  completed: { label: "Hoàn tất", color: "success" },
  pending_cancel: { label: "Chờ hủy", color: "orange" },
  payment_failed: { label: "Thanh toán lỗi", color: "error" },
  cancelled: { label: "Đã hủy", color: "default" },
  refunded: { label: "Đã hoàn tiền", color: "magenta" },
};

const Growth = ({ value }: { value?: number }) => {
  const growth = value || 0;
  const positive = growth >= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-600" : "text-rose-600"}`}>
      {positive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      {Math.abs(growth)}%
    </span>
  );
};

const Dashboard = () => {
  const [period, setPeriod] = useState(30);
  const { data: response, isPending, isError, refetch, isFetching } = useDashboard(period);
  const dashboard = response?.data;

  const chartPoints = useMemo(() => {
    if (!dashboard?.daily.length) return "";
    const visible = period === 90
      ? dashboard.daily.filter((_, index) => index % 3 === 0)
      : dashboard.daily;
    const max = Math.max(...visible.map((item) => item.revenue), 1);
    return visible
      .map((item, index) => {
        const x = (index / Math.max(visible.length - 1, 1)) * 100;
        const y = 92 - (item.revenue / max) * 78;
        return `${x},${y}`;
      })
      .join(" ");
  }, [dashboard, period]);

  if (isPending) {
    return <div className="p-5 md:p-8"><Skeleton active paragraph={{ rows: 14 }} /></div>;
  }

  if (isError || !dashboard) {
    return (
      <div className="p-5 md:p-8">
        <Alert
          type="error"
          showIcon
          message="Không thể tải dữ liệu quản trị"
          description="Vui lòng kiểm tra kết nối backend và thử lại."
          action={<Button onClick={() => refetch()}>Thử lại</Button>}
        />
      </div>
    );
  }

  const statusTotal = Object.values(dashboard.orderStatuses).reduce((sum, value) => sum + value, 0);
  const metricCards = [
    {
      title: "Doanh thu",
      value: money.format(dashboard.summary.revenue),
      note: `Trong ${period} ngày`,
      growth: dashboard.summary.growth.revenue,
      icon: <DollarOutlined />,
      tone: "emerald",
    },
    {
      title: "Đơn hàng",
      value: number.format(dashboard.summary.orders),
      note: `Trung bình ${money.format(dashboard.summary.averageOrderValue)}/đơn`,
      growth: dashboard.summary.growth.orders,
      icon: <ShoppingCartOutlined />,
      tone: "blue",
    },
    {
      title: "Khách mua hàng",
      value: number.format(dashboard.summary.activeCustomers),
      note: `${number.format(dashboard.catalog.customers)} tài khoản đang hoạt động`,
      growth: dashboard.summary.growth.activeCustomers,
      icon: <TeamOutlined />,
      tone: "violet",
    },
    {
      title: "Cảnh báo tồn kho",
      value: number.format(dashboard.inventory.lowStock + dashboard.inventory.outOfStock),
      note: `${dashboard.inventory.outOfStock} sản phẩm đã hết hàng`,
      icon: <InboxOutlined />,
      tone: "amber",
    },
  ];

  return (
    <main className="admin-dashboard p-4 sm:p-6 xl:p-8">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Tổng quan doanh nghiệp</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Bảng điều khiển</h1>
          <p className="mt-1 text-sm text-slate-500">
            Cập nhật lúc {dayjs(dashboard.generatedAt).format("HH:mm, DD/MM/YYYY")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={period}
            onChange={setPeriod}
            options={[
              { value: 7, label: "7 ngày gần đây" },
              { value: 30, label: "30 ngày gần đây" },
              { value: 90, label: "90 ngày gần đây" },
            ]}
            className="min-w-40"
          />
          <Tooltip title="Làm mới dữ liệu">
            <Button icon={<ReloadOutlined spin={isFetching} />} onClick={() => refetch()} />
          </Tooltip>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {metricCards.map((card) => (
          <article key={card.title} className="dashboard-card metric-card">
            <div className={`metric-icon metric-icon-${card.tone}`}>{card.icon}</div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <p className="mt-1 truncate text-2xl font-bold text-slate-900">{card.value}</p>
              <div className="mt-2 flex items-center gap-2">
                {card.growth !== undefined && <Growth value={card.growth} />}
                <span className="truncate text-xs text-slate-400">{card.note}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)]">
        <article className="dashboard-card p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="section-title">Xu hướng doanh thu</h2>
              <p className="section-description">Doanh thu ghi nhận từ đơn đã giao hoặc hoàn tất</p>
            </div>
            <strong className="text-sm text-emerald-600">{money.format(dashboard.summary.revenue)}</strong>
          </div>
          <div className="mt-5 h-64 w-full">
            {dashboard.summary.revenue > 0 ? (
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity=".3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity=".02" />
                  </linearGradient>
                </defs>
                {[20, 40, 60, 80].map((y) => (
                  <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#e2e8f0" strokeWidth=".35" />
                ))}
                <polygon points={`0,100 ${chartPoints} 100,100`} fill="url(#revenueGradient)" />
                <polyline points={chartPoints} fill="none" stroke="#059669" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">Chưa có doanh thu trong kỳ</div>
            )}
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>{dayjs(dashboard.daily[0]?.date).format("DD/MM")}</span>
            <span>{dayjs(dashboard.daily.at(-1)?.date).format("DD/MM")}</span>
          </div>
        </article>

        <article className="dashboard-card p-5 sm:p-6">
          <h2 className="section-title">Trạng thái đơn hàng</h2>
          <p className="section-description">Phân bổ trên toàn hệ thống</p>
          <div className="mt-5 space-y-4">
            {Object.entries(dashboard.orderStatuses)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 7)
              .map(([status, count]) => {
                const percent = statusTotal ? Math.round((count / statusTotal) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-600">{statusLabels[status]?.label || status}</span>
                      <span className="text-slate-500">{number.format(count)} · {percent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
          <Link to="/order" className="mt-6 inline-flex text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            Xem tất cả đơn hàng →
          </Link>
        </article>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]">
        <article className="dashboard-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="section-title">Đơn hàng gần đây</h2>
              <p className="section-description">Sáu giao dịch mới nhất</p>
            </div>
            <Link to="/order" className="text-sm font-semibold text-emerald-600">Quản lý đơn</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr><th>Mã đơn</th><th>Khách hàng</th><th>Thanh toán</th><th>Trạng thái</th><th className="text-right">Tổng tiền</th></tr>
              </thead>
              <tbody>
                {dashboard.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="font-mono text-xs font-semibold">#{order._id.slice(-8).toUpperCase()}</td>
                    <td><p className="font-medium text-slate-700">{order.userId?.name || "Khách hàng"}</p><p className="text-xs text-slate-400">{dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}</p></td>
                    <td className="uppercase text-slate-500">{order.paymentMethod}</td>
                    <td><Tag color={statusLabels[order.status]?.color}>{statusLabels[order.status]?.label || order.status}</Tag></td>
                    <td className="text-right font-semibold text-slate-800">{money.format(order.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="dashboard-card p-5 sm:p-6">
          <h2 className="section-title">Sản phẩm bán chạy</h2>
          <p className="section-description">Theo số lượng đơn đã hoàn thành</p>
          <div className="mt-5 space-y-4">
            {dashboard.topProducts.length ? dashboard.topProducts.map((product, index) => (
              <div key={`${product._id.itemType}-${product._id.productId}`} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">{index + 1}</span>
                {product.image ? <img src={product.image} alt="" className="h-11 w-11 rounded-xl object-cover" /> : <div className="h-11 w-11 rounded-xl bg-emerald-50" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-700">{product.name}</p>
                  <p className="text-xs text-slate-400">{number.format(product.quantity)} sản phẩm</p>
                </div>
                <span className="text-xs font-semibold text-slate-600">{money.format(product.revenue)}</span>
              </div>
            )) : <p className="py-10 text-center text-sm text-slate-400">Chưa có dữ liệu bán hàng</p>}
          </div>
        </article>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {[
          ["Khách hàng", dashboard.catalog.customers],
          ["Nhân viên giao hàng", dashboard.catalog.shippers],
          ["Sản phẩm", dashboard.catalog.products],
          ["Đặc sản", dashboard.catalog.specials],
          ["Thực đơn", dashboard.catalog.menus],
          ["Công thức", dashboard.catalog.recipes],
        ].map(([label, value]) => (
          <div key={label} className="dashboard-card px-4 py-5 text-center">
            <p className="text-2xl font-bold text-slate-800">{number.format(Number(value))}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
