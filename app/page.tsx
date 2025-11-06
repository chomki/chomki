import { mockSalesStats, mockBookings } from '@/lib/mockData';

export default function Home() {
  // 오늘 날짜 기준으로 최근 데이터 계산
  const totalRevenue = mockSalesStats.reduce((sum, stat) => sum + stat.revenue, 0);
  const totalBookings = mockSalesStats.reduce((sum, stat) => sum + stat.bookings, 0);
  const avgOccupancy = Math.round(
    mockSalesStats.reduce((sum, stat) => sum + stat.occupancyRate, 0) / mockSalesStats.length
  );

  // 예정된 예약 (confirmed만)
  const upcomingBookings = mockBookings.filter((b) => b.status === 'confirmed');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500 mt-2">호텔 운영 현황을 한눈에 확인하세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">총 매출</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₩{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">총 예약 건수</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalBookings}건</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">평균 객실 점유율</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{avgOccupancy}%</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* 최근 매출 현황 */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">최근 매출 현황</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockSalesStats.map((stat) => (
              <div key={stat.date} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500 w-24">{stat.date}</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${stat.occupancyRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{stat.occupancyRate}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ₩{stat.revenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">{stat.bookings}건</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 예정된 예약 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">예정된 예약</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between border-l-4 border-blue-500 pl-4 py-3"
              >
                <div>
                  <div className="font-semibold text-gray-900">{booking.roomName}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {booking.guestName} · {booking.platform}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-900">
                    {booking.checkIn} ~ {booking.checkOut}
                  </div>
                  <div className="text-sm font-semibold text-blue-600 mt-1">
                    ₩{booking.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
