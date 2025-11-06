'use client';

import { useState } from 'react';
import { mockRooms, mockBookings } from '@/lib/mockData';
import { Booking } from '@/types';

export default function RoomsPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDates, setBlockDates] = useState({
    checkIn: '',
    checkOut: '',
  });

  // 방막기 함수
  const handleBlockRoom = () => {
    if (!selectedRoom || !blockDates.checkIn || !blockDates.checkOut) {
      alert('날짜를 선택해주세요.');
      return;
    }

    const room = mockRooms.find((r) => r.id === selectedRoom);
    if (!room) return;

    const newBooking: Booking = {
      id: `blocked-${Date.now()}`,
      roomId: selectedRoom,
      roomName: room.name,
      guestName: '방막기',
      checkIn: blockDates.checkIn,
      checkOut: blockDates.checkOut,
      status: 'blocked',
      price: 0,
      platform: '직접관리',
    };

    setBookings([...bookings, newBooking]);
    setShowBlockModal(false);
    setBlockDates({ checkIn: '', checkOut: '' });
    setSelectedRoom(null);
    alert('방막기가 완료되었습니다.');
  };

  // 방열기 함수 (차단 해제)
  const handleUnblockRoom = (bookingId: string) => {
    if (confirm('이 방막기를 해제하시겠습니까?')) {
      setBookings(bookings.filter((b) => b.id !== bookingId));
      alert('방열기가 완료되었습니다.');
    }
  };

  // 각 객실별 예약 현황
  const getRoomBookings = (roomId: string) => {
    return bookings.filter((b) => b.roomId === roomId);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">객실 관리</h1>
        <p className="text-gray-500 mt-2">객실별 예약 현황 및 방막기/방열기 관리</p>
      </div>

      {/* 객실 목록 */}
      <div className="space-y-6">
        {mockRooms.map((room) => {
          const roomBookings = getRoomBookings(room.id);
          const blockedBookings = roomBookings.filter((b) => b.status === 'blocked');
          const confirmedBookings = roomBookings.filter((b) => b.status === 'confirmed');

          return (
            <div key={room.id} className="bg-white rounded-lg shadow">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{room.name}</h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>타입: {room.type}</span>
                      <span>최대 인원: {room.capacity}명</span>
                      <span>기본 가격: ₩{room.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRoom(room.id);
                      setShowBlockModal(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    방막기
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    예약 현황 ({roomBookings.length}건)
                  </h3>
                </div>

                {roomBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">예약이 없습니다.</p>
                ) : (
                  <div className="space-y-3">
                    {/* 확정 예약 */}
                    {confirmedBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between border-l-4 border-green-500 bg-green-50 pl-4 pr-4 py-3 rounded"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">
                            {booking.guestName}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {booking.checkIn} ~ {booking.checkOut} · {booking.platform}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-600">
                            ₩{booking.price.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">확정</div>
                        </div>
                      </div>
                    ))}

                    {/* 방막기 */}
                    {blockedBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between border-l-4 border-red-500 bg-red-50 pl-4 pr-4 py-3 rounded"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">
                            🚫 {booking.guestName}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {booking.checkIn} ~ {booking.checkOut}
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnblockRoom(booking.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          방열기
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 방막기 모달 */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">방막기</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  체크인 날짜
                </label>
                <input
                  type="date"
                  value={blockDates.checkIn}
                  onChange={(e) =>
                    setBlockDates({ ...blockDates, checkIn: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  체크아웃 날짜
                </label>
                <input
                  type="date"
                  value={blockDates.checkOut}
                  onChange={(e) =>
                    setBlockDates({ ...blockDates, checkOut: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockDates({ checkIn: '', checkOut: '' });
                  setSelectedRoom(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleBlockRoom}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                방막기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
