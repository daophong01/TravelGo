// src/services/admin.ts
import api from '../lib/api';

export async function getSummary() {
  const res = await api.get('/admin/summary');
  return res.data as {
    revenue: number;
    totalBookings: number;
    totalUsers: number;
    totalDestinations: number;
  };
}

export async function getUsers() {
  const res = await api.get('/admin/users');
  return res.data as Array<{ id: number; email: string; name?: string; role?: string }>;
}

export async function getAdminBookingsPaged(params: { page: number; pageSize: number; sortBy?: string; order?: 'asc'|'desc'; status?: string; from?: string; to?: string }) {
  const res = await api.get('/admin/bookings', { params });
  return res.data as { items: any[]; total: number; page: number; pageSize: number };
}

export async function getAdminReviewsPaged(params: { page: number; pageSize: number; sortBy?: string; order?: 'asc'|'desc'; from?: string; to?: string }) {
  const res = await api.get('/admin/reviews', { params });
  return res.data as { items: any[]; total: number; page: number; pageSize: number };
}

export async function getAdminPaymentsPaged(params: { page: number; pageSize: number; sortBy?: string; order?: 'asc'|'desc'; status?: string; from?: string; to?: string }) {
  const res = await api.get('/admin/payments', { params });
  return res.data as { items: any[]; total: number; page: number; pageSize: number };
}

export async function exportBookingsCSV(params: { status?: string; from?: string; to?: string }) {
  const res = await api.get('/admin/bookings/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function exportReviewsCSV(params: { from?: string; to?: string }) {
  const res = await api.get('/admin/reviews/export', { params, responseType: 'blob' });
  return res.data as Blob;
}

export async function exportPaymentsCSV(params: { status?: string; from?: string; to?: string }) {
  const res = await api.get('/admin/payments/export', { params, responseType: 'blob' });
  return res.data as Blob;
}