import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Ship, 
  AlertTriangle, 
  CheckSquare, 
  Search, 
  Bell, 
  HelpCircle, 
  User,
  LogOut,
  Settings
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 border-l-4 ${
          isActive 
            ? 'border-ceh-400 bg-ceh-800 text-white' 
            : 'border-transparent text-gray-300 hover:bg-ceh-800 hover:text-white'
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
};

const Layout = () => {
  const location = useLocation();

  // Map paths to readable titles
  const getTitle = () => {
    if (location.pathname.includes('dashboard')) return 'Tổng quan (Dashboard)';
    if (location.pathname.includes('registrations')) return 'Quản lý Đăng ký (Bản kê)';
    if (location.pathname.includes('manifest')) return 'Đối chiếu Manifest';
    if (location.pathname.includes('exceptions')) return 'Xử lý Bất thường';
    if (location.pathname.includes('approvals')) return 'Phê duyệt Lãnh đạo';
    return 'Hệ thống Hải quan CEHSoft';
  };

  return (
    <div className="flex h-screen bg-ceh-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-ceh-900 flex flex-col shadow-lg shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-ceh-800">
          <div className="w-8 h-8 bg-ceh-400 rounded flex items-center justify-center mr-3">
            <Ship className="text-white" size={20} />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">CEHSoft Customs</span>
        </div>

        <div className="flex-1 py-6 overflow-y-auto custom-scroll">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nghiệp vụ chính</div>
          <nav className="space-y-1">
            <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Tổng quan" />
            <SidebarItem to="/registrations" icon={FileText} label="Đăng ký Quay vòng" />
            <SidebarItem to="/manifest" icon={CheckSquare} label="Đối chiếu Manifest" />
            <SidebarItem to="/exceptions" icon={AlertTriangle} label="Xử lý Bất thường" />
            <SidebarItem to="/approvals" icon={User} label="Phê duyệt Lãnh đạo" />
          </nav>
          
          <div className="mt-8 px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Hệ thống</div>
          <nav className="space-y-1">
            <SidebarItem to="/ptch-request" icon={Search} label="Tra cứu PTCH" />
            <SidebarItem to="/settings" icon={Settings} label="Cấu hình" />
          </nav>
        </div>

        <div className="p-4 border-t border-ceh-800">
           <div className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer">
              <LogOut size={18} />
              <span className="text-sm font-medium">Đăng xuất</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <div>
            <h1 className="text-xl font-bold text-ceh-900">{getTitle()}</h1>
            <div className="text-xs text-gray-500 flex gap-1">
              <span>Trang chủ</span> &gt; <span className="text-ceh-600">{getTitle()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
               <input 
                 type="text" 
                 placeholder="Tìm kiếm tờ khai/container..." 
                 className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-ceh-400 w-64 transition-all"
               />
               <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
            
            <button className="p-2 text-gray-500 hover:text-ceh-600 hover:bg-ceh-100 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button className="p-2 text-gray-500 hover:text-ceh-600 hover:bg-ceh-100 rounded-full transition-colors">
              <HelpCircle size={20} />
            </button>

            <div className="h-8 w-px bg-gray-300 mx-2"></div>

            <div className="flex items-center gap-3 cursor-pointer">
              <div className="text-right hidden md:block">
                <div className="text-sm font-semibold text-gray-800">Nguyễn Văn Kiểm</div>
                <div className="text-xs text-gray-500">Cán bộ Hải quan</div>
              </div>
              <div className="w-10 h-10 bg-ceh-100 rounded-full border border-ceh-200 flex items-center justify-center text-ceh-600 font-bold">
                NV
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
