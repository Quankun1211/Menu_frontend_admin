import SideBar from "../components/sidebar/SideBar";
import { Outlet } from "react-router";
import AppHoc from "../hocs/appHocs";

function MainLayout() {
    return (
        <div className="flex flex-row h-screen overflow-hidden">
            <div className="w-64 h-full border-r border-gray-200 bg-white overflow-y-auto">
                <SideBar/>
            </div>

            <div className="flex-1 bg-[#f9f9fb] h-full overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}

export default AppHoc(MainLayout);