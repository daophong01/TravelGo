// src/services/settings.ts
import api from '../lib/api';

export async function updateSettings(id: number, data: { name?: string; email?: string; avatarUrl?: string; settings?: Record<string, any> }) {
  const res = await api.put(`/user/${id}/settings`, data);
  return res.data;
}

export async function changePassword(id: number, password: string) {
  const res = await api.put(`/user/${id}/password`, { password });
  return res.data;
}

export async function uploadAvatar(id: number, file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post(`/user/${id}/avatar`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data as { message: string; url: string };
}