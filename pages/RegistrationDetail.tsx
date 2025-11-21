import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_REGISTRATIONS } from '../mockData';
import { Card, StatusBadge, Button } from '../components/UI';
import { validateContainerCheckDigit } from '../utils';
import { ContainerRegistration, RegistrationStatus } from '../types';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileCheck,
  Ship
} from 'lucide-react';

const RegistrationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ContainerRegistration | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Simulate fetching data
  useEffect(() => {
    const found = MOCK_REGISTRATIONS.find(r => r.registrationId === id);
    if (found) setData(found);
  }, [id]);

  if (!data) return <div className="p-8">Loading...</div>;

  const handleApprove = () => {
    alert("Đã duyệt tờ khai! Trạng thái sẽ chuyển sang CONFIRMED.");
    // Logic to update status would go here
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <div>
             <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               {data.registrationId} 
               <StatusBadge status={data.status} />
             </h2>
             <p className="text-sm text-gray-500">Tạo lúc: {new Date(data.submissionDate).toLocaleString('vi-VN')}</p>
          </div>
        </div>
        <div className="flex gap-3">
           {data.status === RegistrationStatus.PENDING && (
             <>
               <Button variant="danger" onClick={() => alert('Từ chối')}>Từ chối</Button>
               <Button variant="primary" onClick={handleApprove} className="flex items-center gap-2">
                 <CheckCircle size={16} /> Phê duyệt
               </Button>
             </>
           )}
           {data.status === RegistrationStatus.INVALID && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>Yêu cầu sửa đổi</Button>
           )}
           {/* Manifest Match Action */}
           <Button variant="secondary" onClick={() => navigate('/manifest')} className="flex items-center gap-2">
             <FileCheck size={16} /> Đối chiếu Manifest
           </Button>
        </div>
      </div>

      {/* Error Summary Panel */}
      {data.validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-bold text-red-800">Phát hiện lỗi dữ liệu</h4>
            <ul className="list-disc list-inside text-sm text-red-700 mt-1">
              {data.validationErrors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: General Info */}
        <div className="space-y-6">
           <Card className="p-6">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Thông tin chung</h3>
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1">Đơn vị nộp</label>
                 <div className="text-sm font-medium text-gray-900">{data.submitter.name}</div>
                 <div className="text-xs text-gray-500">{data.submitter.role}</div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1">Loại hình</label>
                   <div className="font-mono text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded inline-block">{data.registrationType}</div>
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Số lượng</label>
                    <div className="text-sm text-gray-900">{data.containers.length} Cont</div>
                 </div>
               </div>
               <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tham chiếu Manifest</label>
                  <div className="text-sm text-blue-600 font-medium flex items-center gap-1 cursor-pointer hover:underline">
                    <Ship size={14} /> {data.manifestSummary?.manifestId || 'N/A'}
                  </div>
               </div>
             </div>
           </Card>

           <Card className="p-6">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Nhật ký xử lý</h3>
             <div className="relative border-l-2 border-gray-200 ml-2 space-y-6">
                {data.auditTrail.length === 0 && <p className="text-xs text-gray-400 pl-4 italic">Chưa có lịch sử</p>}
                {data.auditTrail.map((log, idx) => (
                  <div key={idx} className="pl-4 relative">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-400"></div>
                    <div className="text-xs font-medium text-gray-500">{new Date(log.timestamp).toLocaleString()}</div>
                    <div className="text-sm text-gray-900 font-medium">{log.action}</div>
                    <div className="text-xs text-gray-600 mt-1">{log.details}</div>
                    <div className="text-xs text-ceh-600 mt-1 font-medium">bởi {log.user}</div>
                  </div>
                ))}
             </div>
           </Card>
        </div>

        {/* Right Column: Container List & Form */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
             <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Danh sách Container</h3>
                {isEditing && <Button variant="outline" className="text-xs h-8 px-2"><Save size={14} className="mr-1"/> Lưu tạm</Button>}
             </div>
             
             <div className="p-0 overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-500">
                   <tr>
                     <th className="px-4 py-2 w-10">#</th>
                     <th className="px-4 py-2">Số Container</th>
                     <th className="px-4 py-2">Kích thước</th>
                     <th className="px-4 py-2 text-center">Rỗng?</th>
                     <th className="px-4 py-2">Trạng thái</th>
                     <th className="px-4 py-2">Ghi chú</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {data.containers.map((cont, idx) => {
                     const isValidCheckDigit = validateContainerCheckDigit(cont.containerNumber);
                     // Override validation logic visualization
                     const displayValid = cont.checkDigitValid && isValidCheckDigit;

                     return (
                       <tr key={idx} className={displayValid ? '' : 'bg-red-50'}>
                         <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                         <td className="px-4 py-3">
                           <div className="flex flex-col">
                             <span className={`font-mono font-medium ${displayValid ? 'text-gray-900' : 'text-red-700 line-through decoration-red-500'}`}>
                               {cont.containerNumber}
                             </span>
                             {!displayValid && (
                               <span className="text-[10px] text-red-600 font-bold flex items-center">
                                 <XCircle size={10} className="mr-1"/> Check Digit Sai
                               </span>
                             )}
                           </div>
                         </td>
                         <td className="px-4 py-3 text-gray-600">{cont.sizeType}</td>
                         <td className="px-4 py-3 text-center">
                            {cont.emptyFlag ? (
                              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">Empty</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-bold">Full</span>
                            )}
                         </td>
                         <td className="px-4 py-3 text-gray-600">{cont.getInOutStatus}</td>
                         <td className="px-4 py-3 text-gray-500 text-xs italic">{cont.notes || '-'}</td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetail;
