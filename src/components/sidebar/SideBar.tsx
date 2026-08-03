import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { Modal } from "antd";
import {
  BadgePercent,
  BookOpen,
  ChevronDown,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Salad,
  Settings,
  ShoppingBasket,
  Soup,
  Users,
  ReceiptText,
  MessageCircle,
} from "lucide-react";
import { useAppStore } from "../../store/app.store";
import useLogout from "../../hooks/useLogOut";
import api from "../../services/axios";
import { useSocket } from "../../context/SocketContext";

type SideBarProps = { onNavigate?: () => void };

export default function SideBar({ onNavigate }: SideBarProps) {
  const { userData } = useAppStore();
  const [modal, contextHolder] = Modal.useModal();
  const { mutate: onLogOut } = useLogout();
  const [expandedItem, setExpandedItem] = useState<string | null>("Sản phẩm");
  const [chatUnread, setChatUnread] = useState(0);
  const socket = useSocket();

  useEffect(() => {
    const refresh = () => api.get("/support-chats/conversations")
      .then((response) => setChatUnread(response.data.unreadCount || 0))
      .catch(() => undefined);
    refresh();
    socket?.on("support_conversation_updated", refresh);
    return () => { socket?.off("support_conversation_updated", refresh); };
  }, [socket]);

  const showLogoutConfirm = () => {
    modal.confirm({
      title: "Đăng xuất khỏi hệ thống?",
      content: "Phiên làm việc hiện tại sẽ kết thúc.",
      okText: "Đăng xuất",
      cancelText: "Ở lại",
      okButtonProps: { danger: true },
      centered: true,
      onOk: onLogOut,
    });
  };

  const menuItems = [
    { name: "Tổng quan", path: "/", icon: LayoutDashboard },
    { name: "Tài khoản", path: "/users", icon: Users },
    { name: "Đơn hàng", path: "/order", icon: ClipboardList },
    { name: "Giao dịch", path: "/transactions", icon: ReceiptText },
    { name: "Tin nhắn", path: "/support-chat", icon: MessageCircle, badge: chatUnread },
    { name: "Danh mục", path: "/manage/category", icon: FolderTree },
    {
      name: "Sản phẩm",
      icon: Package,
      children: [
        { name: "Danh sách sản phẩm", path: "/manage/list/products" },
        { name: "Đặc sản vùng miền", path: "/manage/list/specials" },
        { name: "Thêm sản phẩm", path: "/manage/products/add" },
      ],
    },
    { name: "Nguyên liệu", path: "/ingredients", icon: Salad },
    { name: "Công thức", path: "/recipes", icon: BookOpen },
    { name: "Thực đơn", path: "/menus", icon: Soup },
    { name: "Khuyến mãi", path: "/sales", icon: BadgePercent },
    { name: "Phí vận chuyển", path: "/settings/shipping", icon: Settings },
  ];

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? "bg-emerald-50 text-emerald-700 shadow-sm"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <div className="flex h-full flex-col bg-white">
      {contextHolder}
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
          <ShoppingBasket size={21} />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-900">Bếp Việt Admin</h1>
          <p className="text-xs text-slate-400">Quản trị doanh nghiệp</p>
        </div>
      </div>

      <nav className="custom-scrollbar flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Điều hướng</p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            if (item.children) {
              const expanded = expandedItem === item.name;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => setExpandedItem(expanded ? null : item.name)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    <Icon size={18} />
                    <span className="flex-1 text-left">{item.name}</span>
                    <ChevronDown size={15} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                  </button>
                  {expanded && (
                    <ul className="ml-5 mt-1 space-y-1 border-l border-slate-200 pl-4">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                              `block rounded-lg px-3 py-2 text-sm transition-colors ${
                                isActive ? "bg-emerald-50 font-semibold text-emerald-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                              }`
                            }
                          >
                            {child.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }
            return (
              <li key={item.path}>
                <NavLink to={item.path!} end={item.path === "/"} onClick={onNavigate} className={itemClass}>
                  <Icon size={18} />
                  <span>{item.name}</span>
                  {!!item.badge && <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">{item.badge}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
            {userData?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-700">{userData?.name || "Quản trị viên"}</p>
            <p className="truncate text-xs text-slate-400">{userData?.email}</p>
          </div>
        </div>
        <button
          onClick={showLogoutConfirm}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut size={17} />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
