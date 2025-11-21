
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_REGISTRATIONS } from '../mockData';
import { Card, StatusBadge, Button, Tabs, Modal } from '../components/UI';
import { validateContainerCheckDigit } from '../utils';
import { ContainerRegistration, RegistrationStatus, RequestStatus, RequestType } from '../types';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileCheck,
  Ship,
  Clock,
  FileText,
  Shield,
  Send
} from 'lucide-react';

const RegistrationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ContainerRegistration | null>(null);
  const [isProcessModalOpen, setProcessModalOpen] = useState(false);
  const [officerNote, setOfficerNote] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
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

  const handleProcessRequest = (reqId: string) => {
    setSelectedRequestId(reqId);
    setProcessModalOpen(true);
    setOfficerNote('');
  };

  const submitRequestToLeader = () => {
    alert(`Đã ghi nhận kết quả kiểm tra và chuyển yêu cầu ${selectedRequestId} lên Lãnh đạo.`);
    setProcessModalOpen(false);
  };

  // --- TAB CONTENT RENDERERS ---

  const GeneralInfoTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
         <Card className="p-6">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Thông tin Đơn vị</h3>
           <div className="space-y-4">
             <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">Đơn vị nộp</label>
               <div className="text-sm font-medium text-gray-900">{data.submitter.name}</div>
               <div className="text-xs text-gray-500">{data.submitter.role}</div>
             </div>
             <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">Ngày đăng ký</label>
               <div className="text-sm text-gray-900">{new Date(data.submissionDate).toLocaleString('vi-VN')}</div>
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

      {/* Right Column */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Thông tin Tờ khai</h3>
           <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1">Mã Đăng ký</label>
                 <div className="text-lg font-bold text-ceh-800">{data.registrationId}</div>
              </div>
              <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1">Trạng thái</label>
                 <StatusBadge status={data.status} />
              </div>
              <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1">Loại hình</label>
                 <span className="font-mono text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded">{data.registrationType}</span>
              </div>
              <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tổng số Container</label>
                  <div className="text-sm font-bold">{data.containers.length}</div>
              </div>
              <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Manifest tham chiếu</label>
                  <div className="text-sm text-blue-600 font-medium flex items-center gap-1 cursor-pointer hover:underline">
                    <Ship size={14} /> {data.manifestSummary?.manifestId || 'N/A'}
                  </div>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );

  const ContainerListTab = () => (
    <Card className="h-full flex flex-col">
       <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-800">Danh sách Container chi tiết</h3>
       </div>
       
       <div className="p-0 overflow-x-auto">
         <table className="w-full text-sm text-left">
           <thead className="bg-white text-gray-500 border-b border-gray-200">
             <tr>
               <th className="px-4 py-3 w-10">#</th>
               <th className="px-4 py-3">Số Container</th>
               <th className="px-4 py-3">Số Vận đơn (B/L)</th>
               <th className="px-4 py-3">Kích thước</th>
               <th className="px-4 py-3 text-center">Rỗng?</th>
               <th className="px-4 py-3">Trạng thái</th>
               <th className="px-4 py-3">Ghi chú</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             {data.containers.map((cont, idx) => {
               const isValidCheckDigit = validateContainerCheckDigit(cont.containerNumber);
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
                   <td className="px-4 py-3 font-mono text-gray-600">{cont.billOfLading || '-'}</td>
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
  );

  const ProcessRequestsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Yêu cầu Nghiệp vụ (Gia hạn / Sửa đổi)</h3>
      </div>

      {!data.activeRequests || data.activeRequests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded border border-dashed border-gray-300 text-gray-500">
          Chưa có yêu cầu nào từ Doanh nghiệp.
        </div>
      ) : (
        <div className="grid gap-4">
           {data.activeRequests.map((req) => (
             <Card key={req.requestId} className="p-6 border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start">
                   <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                         <FileText size={24} />
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-gray-900">{req.requestId}</span>
                           <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                             req.type === RequestType.EXTENSION ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                           }`}>
                             {req.type === RequestType.EXTENSION ? 'GIA HẠN LƯU BÃI' : 'SỬA ĐỔI THÔNG TIN'}
                           </span>
                         </div>
                         <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <Clock size={12} /> Gửi lúc: {new Date(req.createdDate).toLocaleString('vi-VN')}
                         </div>
                         <div className="mt-3 bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                            <span className="font-bold text-gray-700">Lý do:</span> {req.reason}
                         </div>
                         {req.attachedDocuments && (
                           <div className="mt-2 text-xs text-blue-600 flex gap-2">
                              {req.attachedDocuments.map((doc, i) => (
                                <span key={i} className="underline cursor-pointer hover:text-blue-800">{doc}</span>
                              ))}
                           </div>
                         )}
                      </div>
                   </div>

                   <div className="text-right">
                      <div className={`text-xs font-bold px-2 py-1 rounded inline-block ${
                        req.status === RequestStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {req.status === RequestStatus.PENDING ? 'CHỜ KIỂM TRA' : req.status}
                      </div>
                      
                      {req.status === RequestStatus.PENDING && (
                         <div className="mt-4">
                            <Button variant="primary" onClick={() => handleProcessRequest(req.requestId)} className="text-xs h-8">
                               Kiểm tra & Xử lý
                            </Button>
                         </div>
                      )}
                   </div>
                </div>
             </Card>
           ))}
        </div>
      )}
    </div>
  );

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

      <Tabs tabs={[
        { id: 'info', label: 'Thông tin chung', content: <GeneralInfoTab /> },
        { id: 'conts', label: 'Danh sách Container', content: <ContainerListTab /> },
        { id: 'requests', label: 'Xử lý Yêu cầu (Sửa/Hủy/Gia hạn)', content: <ProcessRequestsTab /> }
      ]} />

      {/* --- PROCESS MODAL --- */}
      <Modal
         isOpen={isProcessModalOpen}
         onClose={() => setProcessModalOpen(false)}
         title="Xử lý Yêu cầu từ Doanh nghiệp"
         footer={
           <>
             <Button variant="secondary" onClick={() => setProcessModalOpen(false)}>Hủy bỏ</Button>
             <Button variant="primary" onClick={submitRequestToLeader} className="flex items-center gap-2">
                <Send size={14} /> Trình Lãnh đạo
             </Button>
           </>
         }
      >
         <div className="space-y-4">
            <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800 border border-yellow-100">
               <Shield size={16} className="inline mr-1 mb-1"/>
               Cán bộ thực hiện kiểm tra hồ sơ/thực tế trước khi trình Lãnh đạo phê duyệt.
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Kết quả kiểm tra <span className="text-red-500">*</span></label>
               <textarea 
                 className="w-full border border-gray-300 bg-white text-gray-900 rounded px-3 py-2 text-sm focus:border-ceh-600 focus:ring-1 focus:ring-ceh-600"
                 rows={4}
                 placeholder="Nhập kết quả kiểm tra, căn cứ pháp lý..."
                 value={officerNote}
                 onChange={(e) => setOfficerNote(e.target.value)}
               ></textarea>
            </div>

            <div className="flex items-center gap-2">
               <input type="checkbox" id="confirm-check" className="rounded text-ceh-600 focus:ring-ceh-600"/>
               <label htmlFor="confirm-check" className="text-sm text-gray-700">Xác nhận hồ sơ đầy đủ và hợp lệ</label>
            </div>
         </div>
      </Modal>

    </div>
  );
};

export default RegistrationDetail;
