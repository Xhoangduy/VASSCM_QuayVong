
import React, { useState } from 'react';
import { MOCK_EXCEPTIONS } from '../mockData';
import { Card, Button, StatusBadge, Modal } from '../components/UI';
import { ExceptionTicket } from '../types';
import { AlertOctagon, ArrowRight, FileText, MessageSquare, CheckCircle, UserCheck } from 'lucide-react';

const Exceptions = () => {
  const [selectedTicket, setSelectedTicket] = useState<ExceptionTicket | null>(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isProcessModalOpen, setProcessModalOpen] = useState(false);
  const [processAction, setProcessAction] = useState('ESCALATE');
  const [processNote, setProcessNote] = useState('');

  const handleViewDetail = (ticket: ExceptionTicket) => {
    setSelectedTicket(ticket);
    setDetailModalOpen(true);
  };

  const handleOpenProcess = (ticket: ExceptionTicket) => {
    setSelectedTicket(ticket);
    setProcessModalOpen(true);
    setProcessNote('');
  };

  const handleSubmitProcess = () => {
    alert(`Đã cập nhật xử lý: ${processAction} cho ticket ${selectedTicket?.id}`);
    setProcessModalOpen(false);
    // In real app, call API here
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Bất thường</h2>
        <p className="text-gray-500 mt-1">Xử lý các sai lệch giữa Khai báo và Thực tế/Manifest</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_EXCEPTIONS.map(ex => (
          <Card key={ex.id} className="p-0 overflow-hidden border-l-4 border-l-red-500">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-2 rounded-full text-red-600">
                    <AlertOctagon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-800 font-bold text-sm px-2 py-0.5 bg-red-50 rounded border border-red-100">
                        {ex.type}
                      </span>
                      <span className="text-gray-400 text-sm">• {new Date(ex.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mt-2">
                      Container {ex.containerNumber} (Thuộc tờ khai {ex.registrationId})
                    </h3>
                    <p className="text-gray-600 mt-1">{ex.description}</p>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-sm font-bold text-gray-500">ID: {ex.id}</div>
                   <StatusBadge status={ex.status} />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <Button variant="outline" onClick={() => handleViewDetail(ex)}>
                  Xem chi tiết
                </Button>
                {ex.status === 'OPEN' && (
                  <Button variant="primary" onClick={() => handleOpenProcess(ex)} className="flex items-center gap-2">
                    Xử lý ngay <ArrowRight size={16} />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        
        {MOCK_EXCEPTIONS.length === 0 && (
          <div className="text-center py-12 bg-white rounded border border-dashed border-gray-300 text-gray-500">
            Không có bất thường nào cần xử lý.
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Chi tiết Ticket Bất thường"
        footer={<Button onClick={() => setDetailModalOpen(false)}>Đóng</Button>}
      >
        {selectedTicket && (
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <div className="text-xs text-gray-500 uppercase font-semibold">Mã Ticket</div>
                 <div className="text-sm font-mono font-bold text-gray-900">{selectedTicket.id}</div>
               </div>
               <div>
                 <div className="text-xs text-gray-500 uppercase font-semibold">Trạng thái</div>
                 <StatusBadge status={selectedTicket.status} />
               </div>
               <div>
                 <div className="text-xs text-gray-500 uppercase font-semibold">Tờ khai liên quan</div>
                 <div className="text-sm text-ceh-600">{selectedTicket.registrationId}</div>
               </div>
               <div>
                 <div className="text-xs text-gray-500 uppercase font-semibold">Container</div>
                 <div className="text-sm font-bold">{selectedTicket.containerNumber}</div>
               </div>
             </div>

             <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                   <FileText size={16}/> Nội dung sai lệch
                </h4>
                <p className="text-sm text-gray-700">{selectedTicket.description}</p>
                <div className="mt-3 text-xs text-gray-500 italic">
                  Thời gian phát hiện: {new Date(selectedTicket.createdAt).toLocaleString('vi-VN')}
                </div>
             </div>

             <div className="border-t border-gray-200 pt-3">
                <h4 className="text-sm font-bold text-gray-800 mb-2">Lịch sử xử lý</h4>
                <p className="text-sm text-gray-500 italic">Chưa có xử lý nào.</p>
             </div>
          </div>
        )}
      </Modal>

      {/* PROCESS MODAL */}
      <Modal
        isOpen={isProcessModalOpen}
        onClose={() => setProcessModalOpen(false)}
        title="Xử lý Bất thường"
        footer={
          <>
            <Button variant="secondary" onClick={() => setProcessModalOpen(false)}>Hủy</Button>
            <Button variant="primary" onClick={handleSubmitProcess}>Lưu & Cập nhật</Button>
          </>
        }
      >
        <div className="space-y-5">
           <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 flex items-start gap-2">
              <MessageSquare size={16} className="mt-0.5"/>
              <span>Bạn đang xử lý bất thường cho Container <b>{selectedTicket?.containerNumber}</b>. Hãy chọn hành động phù hợp theo quy trình.</span>
           </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hành động <span className="text-red-500">*</span></label>
              <div className="space-y-3">
                 <label className="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="action" 
                      value="ESCALATE" 
                      checked={processAction === 'ESCALATE'}
                      onChange={(e) => setProcessAction(e.target.value)}
                      className="mt-1 text-ceh-600 focus:ring-ceh-600" 
                    />
                    <div>
                       <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                         <UserCheck size={14} /> Chuyển Lãnh đạo phê duyệt
                       </div>
                       <div className="text-xs text-gray-500">Dùng khi cần lãnh đạo xác nhận chấp nhận sai lệch (ví dụ: hàng rời, sai số cho phép).</div>
                    </div>
                 </label>

                 <label className="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="action" 
                      value="REQUEST_INFO" 
                      checked={processAction === 'REQUEST_INFO'}
                      onChange={(e) => setProcessAction(e.target.value)}
                      className="mt-1 text-ceh-600 focus:ring-ceh-600" 
                    />
                    <div>
                       <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                         <MessageSquare size={14} /> Yêu cầu giải trình
                       </div>
                       <div className="text-xs text-gray-500">Gửi thông báo yêu cầu Doanh nghiệp/Cảng giải trình về sai lệch.</div>
                    </div>
                 </label>

                 <label className="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="action" 
                      value="RESOLVE" 
                      checked={processAction === 'RESOLVE'}
                      onChange={(e) => setProcessAction(e.target.value)}
                      className="mt-1 text-ceh-600 focus:ring-ceh-600" 
                    />
                    <div>
                       <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                         <CheckCircle size={14} /> Xác nhận đã xử lý thủ công
                       </div>
                       <div className="text-xs text-gray-500">Đóng ticket này (khi đã kiểm tra thực tế xong).</div>
                    </div>
                 </label>
              </div>
           </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú xử lý <span className="text-red-500">*</span></label>
              <textarea 
                rows={3} 
                value={processNote}
                onChange={(e) => setProcessNote(e.target.value)}
                className="w-full border border-gray-300 bg-white text-gray-900 rounded px-3 py-2 text-sm focus:ring-ceh-600 focus:border-ceh-600"
                placeholder="Nhập nội dung chi tiết, căn cứ xử lý..."
              ></textarea>
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default Exceptions;
