
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_REGISTRATIONS, MOCK_MANIFESTS } from '../mockData';
import { Card, Button, Modal } from '../components/UI';
import { ExceptionType } from '../types';
import { ArrowRightLeft, Check, AlertTriangle, FileText, Database, ArrowRight } from 'lucide-react';

const ManifestMatch = () => {
  const navigate = useNavigate();
  
  // Modal States
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isExceptionModalOpen, setExceptionModalOpen] = useState(false);
  const [selectedContainerForException, setSelectedContainerForException] = useState<string | null>(null);
  
  // Form State for Exception
  const [exceptionType, setExceptionType] = useState<ExceptionType>(ExceptionType.EMPTY_MISMATCH);
  const [exceptionNote, setExceptionNote] = useState('');

  // Hardcoded for demo purposes (REG-2023-002 vs MNF-002)
  const registration = MOCK_REGISTRATIONS.find(r => r.registrationId === "REG-2023-002");
  const manifestData = MOCK_MANIFESTS["MNF-002"];

  if (!registration || !manifestData) return <div>Select a valid registration...</div>;

  const handleCreateException = () => {
    // Simulate API call
    console.log("Creating exception:", {
      regId: registration.registrationId,
      container: selectedContainerForException,
      type: exceptionType,
      note: exceptionNote
    });
    setExceptionModalOpen(false);
    alert(`Đã tạo yêu cầu xử lý bất thường cho Container ${selectedContainerForException}`);
    navigate('/exceptions');
  };

  const handleConfirmMatch = () => {
    setConfirmModalOpen(false);
    alert("Đã xác nhận kết quả đối chiếu. Trạng thái tờ khai chuyển sang: ĐÃ XÁC NHẬN (CONFIRMED).");
    navigate('/registrations/REG-2023-002');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Đối chiếu Manifest</h2>
          <p className="text-gray-500 mt-1">So sánh dữ liệu Khai báo (DN) vs Dữ liệu Cổng Một Cửa (Hải quan)</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Tải lại dữ liệu</Button>
          <Button variant="primary" onClick={() => setConfirmModalOpen(true)}>Xác nhận kết quả</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
         <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-center">
           <div className="text-2xl font-bold text-blue-700">1</div>
           <div className="text-xs text-blue-600 uppercase font-semibold mt-1">Tổng Container Khai báo</div>
         </div>
         <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg text-center">
           <div className="text-2xl font-bold text-purple-700">1</div>
           <div className="text-xs text-purple-600 uppercase font-semibold mt-1">Tìm thấy trên Manifest</div>
         </div>
         <div className="bg-red-50 border border-red-100 p-4 rounded-lg text-center animate-pulse">
           <div className="text-2xl font-bold text-red-700">1</div>
           <div className="text-xs text-red-600 uppercase font-semibold mt-1">Sai lệch thông tin</div>
         </div>
      </div>

      {/* Comparison Table */}
      <Card className="overflow-hidden">
         <div className="grid grid-cols-2 text-xs font-bold uppercase text-gray-500 border-b border-gray-200">
            <div className="p-3 bg-gray-50 flex items-center justify-center gap-2 border-r border-gray-200">
              <FileText size={16}/> Thông tin Khai báo (Doanh nghiệp)
            </div>
            <div className="p-3 bg-gray-50 flex items-center justify-center gap-2">
              <Database size={16}/> Thông tin Manifest (Hải quan)
            </div>
         </div>

         <div className="divide-y divide-gray-200">
           {registration.containers.map((regCont, idx) => {
             const match = manifestData.find(m => m.containerNumber === regCont.containerNumber);
             // Check specific discrepancy rule: Empty vs Full
             const isEmptyMismatch = regCont.emptyFlag !== match?.isEmpty;

             return (
               <div key={idx} className="grid grid-cols-1">
                 {/* Row Container */}
                 <div className={`grid grid-cols-2 ${isEmptyMismatch ? 'bg-red-50' : 'bg-white'}`}>
                    {/* Left: Registration */}
                    <div className="p-4 border-r border-gray-200 relative">
                       <div className="font-bold text-gray-800 text-lg">{regCont.containerNumber}</div>
                       <div className="mt-2 space-y-1 text-sm text-gray-600">
                         <div className="flex justify-between">
                           <span>Size/Type:</span> <span className="font-medium">{regCont.sizeType}</span>
                         </div>
                         <div className="flex justify-between">
                           <span>Trạng thái:</span> 
                           <span className={`font-bold ${regCont.emptyFlag ? 'text-gray-600' : 'text-blue-600'}`}>
                             {regCont.emptyFlag ? 'EMPTY' : 'FULL'}
                           </span>
                         </div>
                       </div>
                       {/* Indicator Arrow */}
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white rounded-full border border-gray-300 p-1 text-gray-400">
                         <ArrowRightLeft size={14} />
                       </div>
                    </div>

                    {/* Right: Manifest */}
                    <div className="p-4 relative">
                       {match ? (
                         <>
                           <div className="font-bold text-gray-800 text-lg">{match.containerNumber}</div>
                           <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <div className="flex justify-between">
                                <span>B/L No:</span> <span className="font-mono">{match.billOfLading}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Trạng thái:</span>
                                <span className={`font-bold ${match.isEmpty ? 'text-gray-600' : 'text-blue-600'} ${isEmptyMismatch ? 'bg-red-200 px-1' : ''}`}>
                                   {match.isEmpty ? 'EMPTY' : 'FULL'}
                                </span>
                              </div>
                           </div>
                         </>
                       ) : (
                         <div className="h-full flex items-center justify-center text-red-500 italic">
                           Không tìm thấy container trong Manifest
                         </div>
                       )}
                    </div>
                 </div>

                 {/* Action Footer for Mismatch */}
                 {isEmptyMismatch && (
                   <div className="bg-red-100 px-4 py-2 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-red-800 text-sm font-bold">
                        <AlertTriangle size={16} />
                        <span>Phát hiện sai lệch: Khai báo FULL nhưng Manifest là EMPTY (hoặc ngược lại)</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" className="text-xs h-8 bg-white">Bỏ qua (Leader duyệt)</Button>
                        <Button 
                          variant="danger" 
                          className="text-xs h-8" 
                          onClick={() => {
                            setSelectedContainerForException(regCont.containerNumber);
                            setExceptionModalOpen(true);
                          }}
                        >
                          Tạo yêu cầu xử lý bất thường
                        </Button>
                      </div>
                   </div>
                 )}
               </div>
             );
           })}
         </div>
      </Card>

      {/* --- MODALS --- */}
      
      {/* 1. Confirm Match Modal */}
      <Modal 
        isOpen={isConfirmModalOpen} 
        onClose={() => setConfirmModalOpen(false)}
        title="Xác nhận kết quả đối chiếu"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmModalOpen(false)}>Hủy bỏ</Button>
            <Button variant="primary" onClick={handleConfirmMatch}>Đồng ý xác nhận</Button>
          </>
        }
      >
        <div className="text-center py-4">
           <Check className="mx-auto text-green-500 mb-3" size={48} />
           <p className="text-gray-700 font-medium">Hệ thống sẽ cập nhật trạng thái tờ khai thành <span className="font-bold text-green-600">CONFIRMED</span>.</p>
           <p className="text-sm text-gray-500 mt-2">Lưu ý: Các container có sai lệch chưa được xử lý sẽ được đánh dấu để theo dõi riêng.</p>
        </div>
      </Modal>

      {/* 2. Create Exception Modal */}
      <Modal
        isOpen={isExceptionModalOpen}
        onClose={() => setExceptionModalOpen(false)}
        title="Tạo yêu cầu xử lý bất thường"
        footer={
          <>
            <Button variant="secondary" onClick={() => setExceptionModalOpen(false)}>Hủy bỏ</Button>
            <Button variant="danger" onClick={handleCreateException}>Gửi yêu cầu</Button>
          </>
        }
      >
        <div className="space-y-4">
           <div className="bg-gray-100 p-3 rounded border border-gray-200 text-sm">
             <span className="font-bold text-gray-600">Container:</span> <span className="font-mono font-bold text-gray-900">{selectedContainerForException}</span>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Loại bất thường</label>
             <select 
               className="w-full border border-gray-300 bg-white text-gray-900 rounded px-3 py-2 text-sm"
               value={exceptionType}
               onChange={(e) => setExceptionType(e.target.value as ExceptionType)}
             >
               <option value={ExceptionType.EMPTY_MISMATCH}>Sai lệch Rỗng/Có hàng (Empty Mismatch)</option>
               <option value={ExceptionType.NOT_IN_LIST}>Không có trong danh sách tạm (Not In List)</option>
               <option value={ExceptionType.ALREADY_PROCESSED}>Đã qua khu vực giám sát (Already Processed)</option>
             </select>
           </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú / Lý do chi tiết</label>
              <textarea 
                className="w-full border border-gray-300 bg-white text-gray-900 rounded px-3 py-2 text-sm"
                rows={4}
                placeholder="Mô tả chi tiết sai lệch..."
                value={exceptionNote}
                onChange={(e) => setExceptionNote(e.target.value)}
              ></textarea>
           </div>

           <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded flex gap-2">
             <AlertTriangle size={14} className="text-blue-500 mt-0.5 shrink-0"/>
             <span>Yêu cầu này sẽ được gửi tới Cổng Một Cửa Quốc Gia và Doanh nghiệp kinh doanh cảng để xác minh.</span>
           </div>
        </div>
      </Modal>

    </div>
  );
};

export default ManifestMatch;
