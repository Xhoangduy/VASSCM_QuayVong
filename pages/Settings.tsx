
import React from 'react';
import { Card, Button } from '../components/UI';
import { Save, Bell, Calendar, Shield } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cấu hình Hệ thống</h2>
        <p className="text-gray-500 mt-1">Thiết lập tham số quy trình quay vòng và thông báo</p>
      </div>

      <Card className="p-6">
         <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
           <Calendar className="text-ceh-600" size={20} /> Tham số Thời gian & Lưu bãi
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Thời hạn lưu bãi mặc định (ngày)</label>
               <input 
                 type="number" 
                 defaultValue={90}
                 className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-sm focus:border-ceh-600"
               />
               <p className="text-xs text-gray-500 mt-1">Thời gian tối đa container được phép lưu tại VN trước khi phải tái xuất.</p>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Cảnh báo quá hạn trước (ngày)</label>
               <input 
                 type="number" 
                 defaultValue={7}
                 className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-sm focus:border-ceh-600"
               />
            </div>
         </div>
      </Card>

      <Card className="p-6">
         <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
           <Shield className="text-ceh-600" size={20} /> Quy tắc Tự động & Phê duyệt
         </h3>
         <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
               <div>
                  <div className="font-medium text-gray-900">Tự động duyệt Tờ khai hợp lệ</div>
                  <div className="text-xs text-gray-500">Nếu Check Digit đúng và Manifest khớp 100%, hệ thống tự động chuyển trạng thái CONFIRMED.</div>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" className="sr-only peer" defaultChecked />
                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ceh-600"></div>
               </label>
            </div>

            <div className="flex items-center justify-between">
               <div>
                  <div className="font-medium text-gray-900">Yêu cầu Leader duyệt khi có sai lệch Rỗng/Đầy</div>
                  <div className="text-xs text-gray-500">Bắt buộc chuyển cấp lãnh đạo khi phát hiện Empty Mismatch.</div>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" className="sr-only peer" defaultChecked />
                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ceh-600"></div>
               </label>
            </div>
         </div>
      </Card>

      <div className="flex justify-end pt-4">
         <Button className="flex items-center gap-2">
            <Save size={18} /> Lưu cấu hình
         </Button>
      </div>
    </div>
  );
};

export default Settings;
