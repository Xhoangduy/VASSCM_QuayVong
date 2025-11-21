
import { ContainerRegistration, RegistrationStatus, RegistrationType, GetInOutStatus, ManifestRecord, ExceptionTicket, ExceptionType, PTCHHistory } from './types';

export const MOCK_REGISTRATIONS: ContainerRegistration[] = [
  {
    registrationId: "REG-2023-001",
    submissionDate: "2023-10-25T08:30:00Z",
    submitter: { name: "Evergreen Marine Corp", role: "Hãng tàu" },
    registrationType: RegistrationType.TNTX,
    containers: [
      { containerNumber: "EGHU1234567", checkDigitValid: true, emptyFlag: true, getInOutStatus: GetInOutStatus.GETIN, sizeType: "40HC", manifestRef: "MNF-001" },
      { containerNumber: "EGHU8888888", checkDigitValid: false, emptyFlag: true, getInOutStatus: GetInOutStatus.GETIN, sizeType: "20DC", notes: "Sai check digit" }
    ],
    validationErrors: ["Container EGHU8888888 sai định dạng Check Digit"],
    status: RegistrationStatus.INVALID,
    auditTrail: [],
    manifestSummary: { totalMatched: 1, totalMismatch: 0, manifestId: "MNF-001" }
  },
  {
    registrationId: "REG-2023-002",
    submissionDate: "2023-10-26T09:15:00Z",
    submitter: { name: "Logistics Saigon JBL", role: "Đại lý" },
    registrationType: RegistrationType.TXTN,
    containers: [
      { containerNumber: "TCNU1234560", checkDigitValid: true, emptyFlag: false, getInOutStatus: GetInOutStatus.GETOUT, sizeType: "40HC", manifestRef: "MNF-002" }
    ],
    validationErrors: [],
    status: RegistrationStatus.PENDING,
    auditTrail: [
        { timestamp: "2023-10-26T09:15:00Z", action: "SUBMIT", user: "System", details: "Nhận bản khai từ Cổng Một Cửa" }
    ],
    manifestSummary: { totalMatched: 0, totalMismatch: 1, manifestId: "MNF-002" }
  },
  {
    registrationId: "REG-2023-003",
    submissionDate: "2023-10-26T10:00:00Z",
    submitter: { name: "CMA CGM Vietnam", role: "Hãng tàu" },
    registrationType: RegistrationType.TNTX,
    containers: [
      { containerNumber: "CMAU1239875", checkDigitValid: true, emptyFlag: true, getInOutStatus: GetInOutStatus.GETIN, sizeType: "20DC" },
       { containerNumber: "CMAU5554442", checkDigitValid: true, emptyFlag: true, getInOutStatus: GetInOutStatus.GETIN, sizeType: "40HC" }
    ],
    validationErrors: [],
    status: RegistrationStatus.CONFIRMED,
    assignedOfficer: "Nguyễn Văn A",
    auditTrail: [],
    manifestSummary: { totalMatched: 2, totalMismatch: 0, manifestId: "MNF-003" }
  }
];

export const MOCK_MANIFESTS: Record<string, ManifestRecord[]> = {
  "MNF-002": [
    { manifestId: "MNF-002", containerNumber: "TCNU1234560", isEmpty: true, billOfLading: "BL-001", weight: 3500 }
  ]
};

export const MOCK_EXCEPTIONS: ExceptionTicket[] = [
  {
    id: "EXC-001",
    registrationId: "REG-2023-002",
    containerNumber: "TCNU1234560",
    type: ExceptionType.EMPTY_MISMATCH,
    status: 'OPEN',
    createdAt: "2023-10-26T09:20:00Z",
    description: "Khai báo có hàng (Full) nhưng Manifest ghi nhận Rỗng (Empty)"
  }
];

export const MOCK_PTCH_HISTORY: PTCHHistory[] = [
  {
    containerNumber: "TCNU1234560",
    sizeType: "40HC",
    currentStatus: "IN_PORT",
    cycles: [
      {
        cycleId: "CYC-2023-001",
        importDate: "2023-10-01T08:00:00Z",
        registrationIn: "REG-2023-001-IN",
        status: "OPEN"
      }
    ]
  },
  {
    containerNumber: "CMAU1239875",
    sizeType: "20DC",
    currentStatus: "EXPORTED",
    cycles: [
      {
        cycleId: "CYC-2023-999",
        importDate: "2023-09-15T08:00:00Z",
        exportDate: "2023-09-20T14:00:00Z",
        registrationIn: "REG-OLD-01",
        registrationOut: "REG-OLD-02",
        status: "CLOSED"
      }
    ]
  }
];
