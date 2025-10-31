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