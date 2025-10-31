// src/services/review.ts
import api from '../lib/api';

export async function getUserReviews(userId: number) {
  const res = await api.get(`/review/user/${userId}`);
  return res.data as Array<{
    id: number;
    rating: number;
    comment?: string;
    destinationId: number;
  }>;
}