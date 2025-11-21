/**
 * Calculates the ISO 6346 check digit for a container number.
 * @param containerNumber The 11-character container number (or first 10).
 * @returns true if valid, false otherwise.
 */
export const validateContainerCheckDigit = (containerNumber: string): boolean => {
  if (!containerNumber || containerNumber.length !== 11) return false;

  const code = containerNumber.toUpperCase();
  const charMap: { [key: string]: number } = {
    A: 10, B: 12, C: 13, D: 14, E: 15, F: 16, G: 17, H: 18, I: 19, J: 20, K: 21,
    L: 23, M: 24, N: 25, O: 26, P: 27, Q: 28, R: 29, S: 30, T: 31, U: 32, V: 34,
    W: 35, X: 36, Y: 37, Z: 38
  };

  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const char = code[i];
    let val = 0;

    if (/[0-9]/.test(char)) {
      val = parseInt(char, 10);
    } else if (charMap[char]) {
      val = charMap[char];
    } else {
      return false; // Invalid character
    }

    sum += val * Math.pow(2, i);
  }

  let remainder = sum % 11;
  if (remainder === 10) remainder = 0; // ISO 6346 rule

  const checkDigit = parseInt(code[10], 10);
  return remainder === checkDigit;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatStatus = (status: string) => {
  switch(status) {
    case 'PENDING': return 'Chờ xử lý';
    case 'CONFIRMED': return 'Đã xác nhận';
    case 'INVALID': return 'Không hợp lệ';
    case 'REJECTED': return 'Từ chối';
    case 'CHECKING': return 'Đang kiểm tra';
    default: return status;
  }
};
