// 객실 타입
export interface Room {
  id: string;
  name: string;
  type: 'standard' | 'deluxe' | 'suite';
  price: number;
  capacity: number;
  description: string;
}

// 예약 상태
export type BookingStatus = 'confirmed' | 'blocked' | 'available';

// 예약 정보
export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  price: number;
  platform: string; // 예약 플랫폼 (에어비앤비, 부킹닷컴 등)
}

// 후기 정보
export interface Review {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  platform: string;
  rating: number;
  comment: string;
  date: string;
  response?: string; // 사장님 답변
}

// 매출 통계
export interface SalesStats {
  date: string;
  revenue: number;
  bookings: number;
  occupancyRate: number;
}
