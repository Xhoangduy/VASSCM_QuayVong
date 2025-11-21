
import React, { useState } from 'react';
import { Card, Button } from '../components/UI';
import { Search, Clock, MapPin, Anchor, ArrowRight } from 'lucide-react';
import { MOCK_PTCH_HISTORY } from '../mockData';
import { PTCHHistory } from '../types';
import { validateContainerCheckDigit } from '../utils';

const PTCHSearch = () => {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<PTCHHistory | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setError('');
    setResult(null);

    if (!searchId) {
      setError('Vui lòng nhập số Container.');
      return;
    }

    // Mock search logic
    const found = MOCK_PTCH_HISTORY.find(p => p.containerNumber === searchId.toUpperCase());
    if (found) {
      setResult(found);
    } else {
      // Check digit warning if not found but invalid format
      if (searchId.length === 11 && !validateContainerCheckDigit(searchId)) {
        setError('Lưu ý: Số container nhập vào có Check Digit không hợp lệ theo ISO 6346.');
      }
    }
  };

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-2xl font-bold text-gray-900">Tra cứu PTCH</h2>
          <p className="text-gray-500 mt-1">Theo dõi lịch sử quay vòng và trạng thái hiện tại của phương tiện chứa hàng</p>
       </div>

       <Card className="p-8">
         <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Nhập số Container (VD: TCNU1234560)"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-ceh-400 focus:border-ceh-400 outline-none text-lg font-mono uppercase"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={24} />
              <div className="absolute right-2 top-2">
                 <Button type="submit" className="h-10">Tra cứu</Button>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm mt-2 text-center font-medium">{error}</p>}
         </form>
       </Card>

       {hasSearched && !result && !error && (
         <div className="text-center py-12 text-gray-500">
            Không tìm thấy dữ liệu cho container <span className="font-bold font-mono">{searchId}</span>
         </div>
       )}

       {result && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Left: Status Card */}
            <div className="lg:col-span-1">
               <Card className="p-6 h-full border-t-4 border-t-ceh-600">
                  <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Trạng thái hiện tại</h3>
                  <div className="text-3xl font-bold text-ceh-900 font-mono mb-1">{result.containerNumber}</div>
                  <div className="text-lg text-gray-600 mb-6">{result.sizeType}</div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${result.currentStatus === 'IN_PORT' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                           <Anchor size={20} />
                        </div>
                        <div>
                           <div className="text-xs text-gray-500 uppercase">Tình trạng</div>
                           <div className="font-bold text-gray-900">
                             {result.currentStatus === 'IN_PORT' ? 'Đang trong lãnh thổ VN' : 'Đã tái xuất / Chưa vào'}
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                           <MapPin size={20} />
                        </div>
                        <div>
                           <div className="text-xs text-gray-500 uppercase">Vị trí ghi nhận cuối</div>
                           <div className="font-bold text-gray-900">Cảng Cát Lái (Giả lập)</div>
                        </div>
                     </div>
                  </div>
               </Card>
            </div>

            {/* Right: Timeline */}
            <div className="lg:col-span-2">
               <Card className="p-6">
                  <h3 className="text-gray-900 text-lg font-bold mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-ceh-600" /> Lịch sử vòng quay (Cycles)
                  </h3>
                  
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                     {result.cycles.map((cycle, idx) => (
                       <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          {/* Icon */}
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-ceh-600 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                             <ArrowRight size={18} />
                          </div>
                          
                          {/* Card Content */}
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow-sm">
                             <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-ceh-700 text-sm">{cycle.cycleId}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                  cycle.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {cycle.status}
                                </span>
                             </div>
                             <div className="text-sm text-slate-600 space-y-1">
                               <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="block text-xs text-gray-400">Ngày Tạm Nhập</span>
                                    <span className="font-medium">{new Date(cycle.importDate).toLocaleDateString('vi-VN')}</span>
                                  </div>
                                  {cycle.exportDate && (
                                    <div>
                                      <span className="block text-xs text-gray-400">Ngày Tái Xuất</span>
                                      <span className="font-medium">{new Date(cycle.exportDate).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                  )}
                               </div>
                               <div className="pt-2 mt-2 border-t border-gray-100 text-xs">
                                 Đăng ký vào: <span className="text-ceh-600 cursor-pointer hover:underline">{cycle.registrationIn}</span>
                               </div>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </Card>
            </div>
         </div>
       )}
    </div>
  );
};

export default PTCHSearch;
