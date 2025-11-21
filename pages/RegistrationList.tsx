import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_REGISTRATIONS } from '../mockData';
import { Card, StatusBadge, Button } from '../components/UI';
import { formatDate } from '../utils';
import { 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  AlertCircle 
} from 'lucide-react';

const RegistrationList = () => {
  const [filterType, setFilterType] = useState('ALL');

  const filteredData = filterType === 'ALL' 
    ? MOCK_REGISTRATIONS 
    : MOCK_REGISTRATIONS.filter(r => r.registrationType === filterType);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Danh sách Đăng ký</h2>
           <p className="text-gray-500 text-sm mt-1">Quản lý các tờ khai phương tiện quay vòng (TNTX/TXTN)</p>
        </div>
        <Link to="/registrations/new">
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            <span>Tạo đăng ký mới</span>
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-2">
            {['ALL', 'TNTX', 'TXTN'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  filterType === type 
                    ? 'bg-ceh-200 text-ceh-800' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'ALL' ? 'Tất cả' : type}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button variant="secondary" className="flex items-center gap-2 text-xs">
              <Filter size={14} /> Lọc nâng cao
            </Button>
            <Button variant="secondary" className="flex items-center gap-2 text-xs">
              <Download size={14} /> Xuất Excel
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-3 border-b border-gray-200">Mã Đăng ký</th>
                <th className="px-6 py-3 border-b border-gray-200">Ngày gửi</th>
                <th className="px-6 py-3 border-b border-gray-200">Người nộp</th>
                <th className="px-6 py-3 border-b border-gray-200">Loại hình</th>
                <th className="px-6 py-3 border-b border-gray-200">Số lượng Cont</th>
                <th className="px-6 py-3 border-b border-gray-200">Lỗi Valid</th>
                <th className="px-6 py-3 border-b border-gray-200">Trạng thái</th>
                <th className="px-6 py-3 border-b border-gray-200 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((row) => (
                <tr key={row.registrationId} className="hover:bg-blue-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-ceh-800">{row.registrationId}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(row.submissionDate)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{row.submitter.name}</div>
                    <div className="text-xs text-gray-500">{row.submitter.role}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${
                      row.registrationType === 'TNTX' 
                        ? 'bg-orange-50 text-orange-700 border-orange-200' 
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {row.registrationType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {row.containers.length}
                  </td>
                  <td className="px-6 py-4">
                    {row.validationErrors.length > 0 ? (
                      <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-full w-fit">
                        <AlertCircle size={12} /> {row.validationErrors.length}
                      </span>
                    ) : (
                      <span className="text-green-500 text-xs">---</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Link to={`/registrations/${row.registrationId}`}>
                          <button className="p-1.5 text-gray-500 hover:text-ceh-600 hover:bg-gray-200 rounded" title="Xem chi tiết">
                            <Eye size={16} />
                          </button>
                       </Link>
                       <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-200 rounded" title="Chỉnh sửa">
                         <Edit2 size={16} />
                       </button>
                       <button className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded">
                         <MoreHorizontal size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Không tìm thấy dữ liệu phù hợp.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RegistrationList;
