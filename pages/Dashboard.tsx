import React from 'react';
import { Card } from '../components/UI';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  AlertCircle, 
  FileText 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KpiCard = ({ title, value, trend, icon: Icon, color }: any) => (
  <Card className="p-5">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs">
      <span className={trend > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
        {trend > 0 ? "+" : ""}{trend}%
      </span>
      <span className="text-gray-400 ml-2">so với hôm qua</span>
    </div>
  </Card>
);

const data = [
  { name: 'Thứ 2', TNTX: 400, TXTN: 240 },
  { name: 'Thứ 3', TNTX: 300, TXTN: 139 },
  { name: 'Thứ 4', TNTX: 200, TXTN: 980 },
  { name: 'Thứ 5', TNTX: 278, TXTN: 390 },
  { name: 'Thứ 6', TNTX: 189, TXTN: 480 },
  { name: 'Thứ 7', TNTX: 239, TXTN: 380 },
  { name: 'CN', TNTX: 349, TXTN: 430 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Đăng ký mới (Hôm nay)" 
          value="124" 
          trend={12} 
          icon={FileText} 
          color="bg-blue-100 text-blue-600" 
        />
        <KpiCard 
          title="Container Tái xuất" 
          value="45" 
          trend={-5} 
          icon={ArrowUpRight} 
          color="bg-green-100 text-green-600" 
        />
        <KpiCard 
          title="Container Tái nhập" 
          value="32" 
          trend={8} 
          icon={ArrowDownLeft} 
          color="bg-purple-100 text-purple-600" 
        />
        <KpiCard 
          title="Cảnh báo sai lệch" 
          value="3" 
          trend={0} 
          icon={AlertCircle} 
          color="bg-red-100 text-red-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Biến động lượng tờ khai tuần qua</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="TNTX" fill="#0B5FA5" radius={[4, 4, 0, 0]} name="Tạm Nhập Tái Xuất" />
                <Bar dataKey="TXTN" fill="#2C9FEA" radius={[4, 4, 0, 0]} name="Tạm Xuất Tái Nhập" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Nhiệm vụ cần xử lý</h3>
          <div className="space-y-4">
            {[
              { title: "Xác nhận tờ khai TNTX", id: "REG-2023-002", time: "10 phút trước", status: "pending" },
              { title: "Kiểm tra sai lệch Rỗng/Có hàng", id: "EXC-001", time: "30 phút trước", status: "urgent" },
              { title: "Phê duyệt danh sách PTCH", id: "LST-998", time: "1 giờ trước", status: "normal" },
              { title: "Gia hạn thời gian lưu container", id: "EXT-005", time: "2 giờ trước", status: "normal" },
            ].map((task, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 cursor-pointer">
                <div className={`mt-1 w-2 h-2 rounded-full ${task.status === 'urgent' ? 'bg-red-500' : 'bg-ceh-400'}`}></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                  <div className="text-xs text-gray-500 mt-1">ID: {task.id} • {task.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-center text-sm text-ceh-600 font-medium hover:underline">
            Xem tất cả nhiệm vụ
          </button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
