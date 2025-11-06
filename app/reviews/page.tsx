'use client';

import { useState } from 'react';
import { mockReviews } from '@/lib/mockData';
import { Review } from '@/types';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');

  // 별점 렌더링
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // 답변 등록
  const handleSubmitResponse = () => {
    if (!selectedReview || !responseText.trim()) {
      alert('답변을 입력해주세요.');
      return;
    }

    const updatedReviews = reviews.map((review) =>
      review.id === selectedReview.id
        ? { ...review, response: responseText }
        : review
    );

    setReviews(updatedReviews);
    setShowResponseModal(false);
    setSelectedReview(null);
    setResponseText('');
    alert('답변이 등록되었습니다.');
  };

  // 통계 계산
  const averageRating = (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  ).toFixed(1);
  const totalReviews = reviews.length;
  const respondedReviews = reviews.filter((r) => r.response).length;
  const responseRate = Math.round((respondedReviews / totalReviews) * 100);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">후기 관리</h1>
        <p className="text-gray-500 mt-2">고객 후기를 확인하고 답변을 등록하세요</p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">평균 평점</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{averageRating}</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">전체 후기</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalReviews}개</p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">답변률</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{responseRate}%</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      {/* 후기 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">후기 목록</h2>
        </div>
        <div className="divide-y">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-semibold text-gray-900">
                      {review.guestName}
                    </span>
                    <span className="text-sm text-gray-500">{review.date}</span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {review.platform}
                    </span>
                  </div>
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  <div className="text-sm text-gray-600 mb-2">{review.roomName}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                <p className="text-gray-900">{review.comment}</p>
              </div>

              {review.response ? (
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-semibold text-blue-900">
                      사장님 답변
                    </span>
                  </div>
                  <p className="text-gray-900">{review.response}</p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setShowResponseModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  답변 작성
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 답변 작성 모달 */}
      {showResponseModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">답변 작성</h3>

            {/* 원본 후기 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-semibold text-gray-900">
                  {selectedReview.guestName}
                </span>
                <span className="text-sm text-gray-500">{selectedReview.date}</span>
              </div>
              <div className="mb-2">{renderStars(selectedReview.rating)}</div>
              <p className="text-gray-900">{selectedReview.comment}</p>
            </div>

            {/* 답변 입력 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                답변 내용
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="고객님께 감사 인사와 함께 정성스러운 답변을 남겨주세요..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedReview(null);
                  setResponseText('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubmitResponse}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                답변 등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
