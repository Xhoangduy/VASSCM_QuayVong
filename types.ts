
// DATA_MAPPING: These types strictly follow the provided JSON schema requirements
// and business domain entities for "Quay vòng".

export enum RegistrationType {
  TNTX = 'TNTX', // Tạm nhập tái xuất
  TXTN = 'TXTN', // Tạm xuất tái nhập
  RX = 'RX',     // Rỗng xuất (Assumed)
  RN = 'RN'      // Rỗng nhập (Assumed)
}

export enum RegistrationStatus {
  PENDING = 'PENDING',     // Chờ xử lý
  INVALID = 'INVALID',     // Không hợp lệ
  CONFIRMED = 'CONFIRMED', // Đã xác nhận
  REJECTED = 'REJECTED',   // Từ chối
  CHECKING = 'CHECKING'    // Đang kiểm tra (Physically check)
}

export enum GetInOutStatus {
  GETIN = 'GETIN',
  GETOUT = 'GETOUT',
  NOT_IN = 'NOT_IN'
}

export enum ExceptionType {
  EMPTY_MISMATCH = 'EMPTY_MISMATCH', // Khai rỗng nhưng soi chiếu có hàng
  NOT_IN_LIST = 'NOT_IN_LIST',       // Không có trong danh sách tạm
  ALREADY_PROCESSED = 'ALREADY_PROCESSED' // Đã qua khu vực giám sát
}

// New Types for Process Requests (Edit/Cancel/Extension) based on Page 4 & 27
export enum RequestType {
  EXTENSION = 'EXTENSION',       // Gia hạn lưu bãi
  CANCELLATION = 'CANCELLATION', // Hủy tờ khai
  EDIT = 'EDIT',                 // Sửa đổi thông tin
  CHANGE_PURPOSE = 'CHANGE_PURPOSE' // Chuyển đổi mục đích sử dụng
}

export enum RequestStatus {
  PENDING = 'PENDING',           // Chờ cán bộ kiểm tra
  VERIFIED = 'VERIFIED',         // Cán bộ đã kiểm tra, chờ Lãnh đạo
  APPROVED = 'APPROVED',         // Lãnh đạo đồng ý
  REJECTED = 'REJECTED'          // Từ chối
}

export interface ProcessRequest {
  requestId: string;
  type: RequestType;
  createdDate: string;
  reason: string;
  status: RequestStatus;
  officerNote?: string; // Kết quả kiểm tra của cán bộ
  leaderNote?: string;  // Ý kiến lãnh đạo
  attachedDocuments?: string[]; // File đính kèm
}

export interface Container {
  containerNumber: string; // Req: 11 chars
  checkDigitValid: boolean; // Calculated via ISO 6346
  emptyFlag: boolean;
  getInOutStatus: GetInOutStatus;
  manifestRef?: string;
  billOfLading?: string; // Added based on Page 24 matching requirements
  sizeType: string; // e.g., 20DC, 40HC
  notes?: string;
}

export interface Submitter {
  name: string;
  role: string; // e.g., "Hãng tàu", "Đại lý", "Logistics"
}

export interface AuditLog {
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export interface ContainerRegistration {
  registrationId: string;
  submissionDate: string; // ISO Date
  submitter: Submitter;
  registrationType: RegistrationType;
  containers: Container[];
  manifestSummary?: {
    totalMatched: number;
    totalMismatch: number;
    manifestId: string;
  };
  validationErrors: string[];
  status: RegistrationStatus;
  assignedOfficer?: string;
  auditTrail: AuditLog[];
  activeRequests?: ProcessRequest[]; // List of active requests associated with this registration
}

export interface ManifestRecord {
  manifestId: string;
  containerNumber: string;
  isEmpty: boolean;
  billOfLading: string;
  weight: number;
}

export interface ExceptionTicket {
  id: string;
  registrationId: string;
  containerNumber: string;
  type: ExceptionType;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
  description: string;
}

export interface PTCHHistory {
  containerNumber: string;
  sizeType: string;
  currentStatus: 'IN_PORT' | 'EXPORTED' | 'UNKNOWN';
  cycles: {
    cycleId: string;
    importDate: string;
    exportDate?: string;
    registrationIn: string;
    registrationOut?: string;
    status: 'OPEN' | 'CLOSED' | 'OVERDUE';
  }[];
}
