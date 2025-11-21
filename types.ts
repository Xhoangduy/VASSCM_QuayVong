
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

export interface Container {
  containerNumber: string; // Req: 11 chars
  checkDigitValid: boolean; // Calculated via ISO 6346
  emptyFlag: boolean;
  getInOutStatus: GetInOutStatus;
  manifestRef?: string;
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

// New Type for PTCH Search
export interface PTCHHistory {
  containerNumber: string;
  sizeType: string;
  currentStatus: 'IN_PORT' | 'EXPORTED' | 'UNKNOWN'; // Trạng thái hiện tại
  cycles: {
    cycleId: string;
    importDate: string; // Ngày tạm nhập
    exportDate?: string; // Ngày tái xuất (nếu có)
    registrationIn: string;
    registrationOut?: string;
    status: 'OPEN' | 'CLOSED' | 'OVERDUE'; // Chu trình đóng hay mở hay quá hạn
  }[];
}
