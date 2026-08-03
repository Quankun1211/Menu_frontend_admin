import { useState } from "react";
import { Outlet } from "react-router";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import SideBar from "../components/sidebar/SideBar";
import AppHoc from "../hocs/appHocs";

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="hidden h-full w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
        <SideBar />
      </aside>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        placement="left"
        width={288}
        styles={{ body: { padding: 0 } }}
        closable={false}
      >
        <SideBar onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <div className="min-w-0 flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden">
          <Button type="text" icon={<MenuOutlined />} onClick={() => setMobileOpen(true)} />
          <div className="ml-3">
            <p className="text-sm font-bold text-slate-800">Bếp Việt Admin</p>
            <p className="text-[11px] text-slate-400">Hệ thống quản trị</p>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}

export default AppHoc(MainLayout);
