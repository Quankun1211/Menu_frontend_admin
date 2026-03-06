import { useState } from "react";
import { NavLink } from "react-router";
import { useAppStore } from "../../store/app.store";
import useLogout from "../../hooks/useLogOut";
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

export default function SideBar() {
    const { userData } = useAppStore();
    const [modal, contextHolder] = Modal.useModal();
    const { mutate: onLogOut } = useLogout();
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const toggleExpand = (name: string) => {
        setExpandedItem(expandedItem === name ? null : name);
    };

    const showLogoutConfirm = () => {
        modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn đăng xuất không?',
            okText: 'Đăng xuất',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            centered: true,
            onOk: onLogOut,
        });
    };

    const menuItems = [
        { name: "Bảng điều khiển", path: "/" },
        { name: "Quản lý tài khoản", path: "/users" },
        { name: "Quản lý đơn hàng", path: "/order" },
        { name: "Quản lý danh mục", path: "/manage/category" },
        { 
            name: "Quản lý sản phẩm", 
            children: [
                { name: "Sản phẩm", path: "/manage/list/products" },
                { name: "Đặc sản", path: "/manage/list/specials" },
                { name: "Thêm mới", path: "/manage/add-product" }
            ]
        },
        { name: "Quản lý nguyên liệu", path: "/ingredients" },
        { name: "Quản lý công thức", path: "/recipes" },
        { name: "Quản lý thực đơn", path: "/menus" },
        { name: "Quản lý Sale", path: "/sales" },
        { name: "Khách hàng", path: "/notifications" },
        { name: "Thống kê", path: "/settings" },
    ];

    return (
        <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
            {contextHolder}

            <div className="p-6">
                <h1 className="text-xl font-bold text-gray-800">Trang quản lý</h1>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Super Admin</p>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                <ul className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            {item.children ? (
                                <div>
                                    <button
                                        onClick={() => toggleExpand(item.name)}
                                        className="w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
                                    >
                                        <span className="text-sm font-medium">{item.name}</span>
                                        <FontAwesomeIcon 
                                            icon={faAngleDown} 
                                            className={`text-xs transition-transform duration-200 ${expandedItem === item.name ? 'rotate-180' : ''}`} 
                                        />
                                    </button>
                                    
                                    {expandedItem === item.name && (
                                        <ul className="pl-6 mt-1 flex flex-col gap-1 border-l-2 border-gray-100 ml-4">
                                            {item.children.map((child) => (
                                                <li key={child.name}>
                                                    <NavLink
                                                        to={child.path}
                                                        className={({ isActive }) =>
                                                            `block px-4 py-2 text-sm rounded-lg transition-colors ${
                                                                isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-500 hover:text-gray-800"
                                                            }`
                                                        }
                                                    >
                                                        {child.name}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `block px-4 py-2 rounded-lg transition-colors text-sm ${
                                            isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100 font-medium"
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-100">
                {userData ? (
                    <div 
                        className="flex items-center gap-3 cursor-pointer p-2 hover:bg-red-50 rounded-lg group transition-colors" 
                        onClick={showLogoutConfirm}
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-red-200 group-hover:text-red-600">
                            {userData?.name?.charAt(0) || "A"}
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">Đăng xuất</span>
                    </div>
                ) : (
                    <NavLink to="/account/login" className="text-sm text-gray-600 px-4 py-2 block hover:text-blue-600">
                        Đăng nhập
                    </NavLink>
                )}
            </div>
        </div>
    );
}