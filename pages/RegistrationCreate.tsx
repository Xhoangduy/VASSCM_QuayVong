
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/UI';
import { RegistrationType, GetInOutStatus, Container } from '../types';
import { validateContainerCheckDigit } from '../utils';
import { ArrowLeft, Plus, Trash2, AlertCircle } from 'lucide-react';

const RegistrationCreate = () => {
  const navigate = useNavigate();
  
  // Form State
  const [type, setType] = useState<RegistrationType>(RegistrationType.TNTX);
  const [submitterName, setSubmitterName] = useState('');
  const [containers, setContainers] = useState<Partial<Container>[]>([
    { containerNumber: '', sizeType: '20DC', emptyFlag: true, notes: '' }
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  // Helper: Add Row
  const addContainerRow = () => {
    setContainers([...containers, { containerNumber: '', sizeType: '20DC', emptyFlag: true, notes: '' }]);
  };

  // Helper: Remove Row
  const removeContainerRow = (index: number) => {
    const newConts = [...containers];
    newConts.splice(index, 1);
    setContainers(newConts);
  };

  // Helper: Update Row
  const updateContainer = (index: number, field: keyof Container, value: any) => {
    const newConts = [...containers];
    newConts[index] = { ...newConts[index], [field]: value };
    setContainers(newConts);
  };

  // Logic: Validate & Submit
  const handleSubmit = (isDraft: boolean) => {
    const newErrors: string[] = [];
    
    if (!submitterName.trim()) newErrors.push('Vui lòng nhập tên đơn vị nộp.');
    
    containers.forEach((c, idx) => {
      if (!c.containerNumber || c.containerNumber.length !== 11) {
        newErrors.push(`Dòng ${idx + 1}: Số container phải đủ 11 ký tự.`);
      } else if (!validateContainerCheckDigit(c.containerNumber)) {
        newErrors.push(`Dòng ${idx + 1}: Container ${c.containerNumber} sai Check Digit (ISO 6346).`);
      }
    });

    if (containers.length === 0) newErrors.push('Phải có ít nhất 1 container.');

    setErrors(newErrors);

    if (newErrors.length === 0 || isDraft) {
      // Mock API Call
      alert(isDraft ? 'Đã lưu nháp thành công!' : 'Đã gửi đăng ký lên hệ thống!');
      navigate('/registrations');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Tạo Đăng ký mới</h2>
           <p className="text-sm text-gray-500">Nhập liệu thủ công bản kê phương tiện quay vòng</p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
           <h4 className="text-sm font-bold text-red-800 flex items-center gap-2">
             <AlertCircle size={16}/> Không thể gửi đăng ký
           </h4>
           <ul className="list-disc list-inside text-sm text-red-700 mt-2">
             {errors.map((e, i) => <li key={i}>{e}</li>)}
           </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: General Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Thông tin chung</h3>
            
            <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình tờ khai <span className="text-red-500">*</span></label>
                 <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value as RegistrationType)}
                    className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:border-ceh-600 focus:ring-1 focus:ring-ceh-600"
                 >
                   <option value={RegistrationType.TNTX}>Tạm Nhập - Tái Xuất (TNTX)</option>
                   <option value={RegistrationType.TXTN}>Tạm Xuất - Tái Nhập (TXTN)</option>
                 </select>
                 <p className="text-xs text-gray-500 mt-1">
                   {type === RegistrationType.TNTX ? 'Container đi vào VN (Có hàng/Rỗng) để sau đó tái xuất.' : 'Container đi ra khỏi VN để sau đó tái nhập.'}
                 </p>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị nộp <span className="text-red-500">*</span></label>
                 <input 
                   type="text"
                   value={submitterName}
                   onChange={(e) => setSubmitterName(e.target.value)}
                   placeholder="VD: Hãng tàu Evergreen"
                   className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:border-ceh-600 focus:ring-1 focus:ring-ceh-600"
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú chung</label>
                 <textarea 
                   rows={3}
                   className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:border-ceh-600 focus:ring-1 focus:ring-ceh-600"
                 ></textarea>
               </div>
            </div>
          </Card>
        </div>

        {/* Right: Container List */}
        <div className="md:col-span-2">
           <Card className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-gray-800">Danh sách Container ({containers.length})</h3>
                 <Button variant="secondary" onClick={addContainerRow} className="flex items-center gap-1 h-8 text-xs">
                   <Plus size={14}/> Thêm dòng
                 </Button>
              </div>

              <div className="flex-1 p-0 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 w-10">#</th>
                      <th className="px-4 py-2 w-40">Số Container <span className="text-red-500">*</span></th>
                      <th className="px-4 py-2 w-24">Size/Type</th>
                      <th className="px-4 py-2 w-24">Trạng thái</th>
                      <th className="px-4 py-2">Ghi chú</th>
                      <th className="px-4 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {containers.map((cont, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-2">
                          <input 
                            type="text" 
                            value={cont.containerNumber}
                            onChange={(e) => updateContainer(idx, 'containerNumber', e.target.value.toUpperCase())}
                            placeholder="AAAA1234567"
                            maxLength={11}
                            className={`w-full border rounded px-2 py-1 font-mono uppercase ${
                              cont.containerNumber && !validateContainerCheckDigit(cont.containerNumber) 
                              ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                              : 'border-gray-300 bg-white focus:border-ceh-600'
                            }`}
                          />
                        </td>
                        <td className="px-4 py-2">
                           <select 
                             value={cont.sizeType}
                             onChange={(e) => updateContainer(idx, 'sizeType', e.target.value)}
                             className="w-full border border-gray-300 bg-white rounded px-2 py-1"
                           >
                             <option value="20DC">20DC</option>
                             <option value="40DC">40DC</option>
                             <option value="40HC">40HC</option>
                             <option value="45HC">45HC</option>
                           </select>
                        </td>
                        <td className="px-4 py-2">
                           <select 
                             value={cont.emptyFlag ? 'EMPTY' : 'FULL'}
                             onChange={(e) => updateContainer(idx, 'emptyFlag', e.target.value === 'EMPTY')}
                             className={`w-full border rounded px-2 py-1 font-bold text-xs ${
                               cont.emptyFlag ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700 border-blue-300'
                             }`}
                           >
                             <option value="EMPTY">Rỗng (Empty)</option>
                             <option value="FULL">Có hàng (Full)</option>
                           </select>
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="text" 
                            value={cont.notes}
                            onChange={(e) => updateContainer(idx, 'notes', e.target.value)}
                            className="w-full border border-gray-300 bg-white rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                           <button 
                             onClick={() => removeContainerRow(idx)}
                             className="text-gray-400 hover:text-red-600 transition-colors"
                             title="Xóa dòng"
                           >
                             <Trash2 size={16} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
         <Button variant="secondary" onClick={() => handleSubmit(true)}>Lưu nháp</Button>
         <Button variant="primary" onClick={() => handleSubmit(false)}>Gửi đăng ký</Button>
      </div>
    </div>
  );
};

export default RegistrationCreate;
