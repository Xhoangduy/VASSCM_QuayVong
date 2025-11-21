
import React, { useState } from 'react';
import { Card, Button, StatusBadge } from '../components/UI';
import { CheckCircle, XCircle, Clock, FileText, ShieldAlert } from 'lucide-react';

// Mock data for approvals
const MOCK_APPROVALS = [
  {
    id: "APV-001",
    type: "EXCEPTION",
    title: "Duyệt sai lệch Manifest (Empty Mismatch)",
    requestor: "Nguyễn Văn A (Cán bộ HQ)",
    createdAt: "2023-10-26T14:00:00Z",
    status: "PENDING",
    details: "Container TCNU1234560 khai Full nhưng Manifest là Empty. Đã kiểm tra thực tế là Rỗng.",
    priority: "HIGH"
  },
  {
    id: "APV-002",
    type: "EXTENSION",
    title: "Xin gia hạn lưu bãi PTCH",
    requestor: "Hãng tàu Evergreen",
    createdAt: "2023-10-26T10:30:00Z",
    status: "PENDING",
    details: "Xin gia hạn container EGHU1234567 thêm 30 ngày do sự cố tàu.",
    priority: "NORMAL"
  }
];

const LeaderApproval = () => {
  const [approvals, setApprovals] = useState(MOCK_APPROVALS);

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    const message = action === 'APPROVE' ? 'Đã phê duyệt yêu cầu.' : 'Đã từ chối yêu cầu.';
    
    alert(message);
    setApprovals(approvals.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Phê duyệt Lãnh đạo</h2>
        <p className="text-gray-500 mt-1">Danh sách công việc cần lãnh đạo xem xét và phê duyệt</p>
      </div>

      <div className="grid gap-4">
        {approvals.length === 0 && (
           <Card className="p-12 text-center text-gray-500">
             <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
             <p>Hiện không có yêu cầu nào cần phê duyệt.</p>
           </Card>
        )}

        {approvals.map((item) => (
          <Card key={item.id} className="p-6 hover:shadow-md transition-shadow">
             <div className="flex flex-col md:flex-row gap-6">
                {/* Icon & Type */}
                <div className="shrink-0">
                   <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      item.type === 'EXCEPTION' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                   }`}>
                      {item.type === 'EXCEPTION' ? <ShieldAlert size={24} /> : <FileText size={24} />}
                   </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                   <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-xs font-bold text-gray-500">{item.id}</span>
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              item.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                           }`}>
                              {item.priority === 'HIGH' ? 'Ưu tiên cao' : 'Bình thường'}
                           </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                         <div className="flex items-center gap-1 justify-end">
                           <Clock size={12} /> {new Date(item.createdAt).toLocaleString('vi-VN')}
                         </div>
                      </div>
                   </div>

                   <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 text-sm text-gray-700">
                      {item.details}
                   </div>
                   
                   <div className="mt-2 text-xs text-gray-500">
                      Người yêu cầu: <span className="font-bold text-gray-700">{item.requestor}</span>
                   </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-2 justify-center shrink-0 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                   <Button 
                     variant="primary" 
                     className="w-full md:w-32 bg-green-600 hover:bg-green-700 text-white flex justify-center items-center gap-2"
                     onClick={() => handleAction(item.id, 'APPROVE')}
                   >
                     <CheckCircle size={16} /> Duyệt
                   </Button>
                   <Button 
                     variant="secondary" 
                     className="w-full md:w-32 bg-white text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 flex justify-center items-center gap-2 transition-colors"
                     onClick={() => handleAction(item.id, 'REJECT')}
                   >
                     <XCircle size={16} /> Từ chối
                   </Button>
                </div>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeaderApproval;
