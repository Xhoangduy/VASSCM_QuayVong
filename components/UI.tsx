
import React, { useEffect, useRef } from 'react';
import { RegistrationStatus } from '../types';
import { X } from 'lucide-react';

export const StatusBadge = ({ status }: { status: string }) => {
  let bg = 'bg-gray-100 text-gray-700';
  let label = status;

  switch (status) {
    case RegistrationStatus.CONFIRMED:
      bg = 'bg-green-100 text-green-700 border border-green-200';
      label = 'Đã xác nhận';
      break;
    case RegistrationStatus.PENDING:
      bg = 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      label = 'Chờ xử lý';
      break;
    case RegistrationStatus.INVALID:
      bg = 'bg-red-50 text-red-700 border border-red-200';
      label = 'Không hợp lệ';
      break;
    case RegistrationStatus.REJECTED:
      bg = 'bg-red-100 text-red-800 border border-red-300';
      label = 'Từ chối';
      break;
    case RegistrationStatus.CHECKING:
      bg = 'bg-blue-50 text-blue-700 border border-blue-200';
      label = 'Đang kiểm hóa';
      break;
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bg}`}>
      {label}
    </span>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = "",
  disabled = false,
  type = "button"
}) => {
  const base = "px-4 py-2 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-ceh-600 text-white hover:bg-ceh-800 focus:ring-ceh-600 shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    outline: "bg-transparent text-ceh-600 border border-ceh-600 hover:bg-ceh-50"
  };

  return (
    <button 
      type={type}
      className={`${base} ${variants[variant]} ${className}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md md:max-w-lg lg:max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scroll">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
