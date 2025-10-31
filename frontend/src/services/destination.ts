// src/services/destination.ts
import api from '../lib/api';

export type Destination = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  featured?: boolean;
  price?: number | null;
  categoryId?: number | null;
  lat?: number | null;
  lng?: number | null;
};

export async function getDestinations() {
  const res = await api.get('/destination');
  return res.data as Destination[];
}

export async function getFeaturedDestinations() {
  const res = await api.get('/destination/featured');
  return res.data as Destination[];
}

export async function getDestinationBySlug(slug: string) {
  const res = await api.get(`/destination/${slug}`);
  return res.data as Destination;
}

// Images
export async function getDestinationImages(id: number) {
  const res = await api.get(`/destination/${id}/images`);
  return res.data as Array<{ id: number; url: string; createdAt: string }>;
}

export async function uploadDestinationImages(id: number, files: File[]) {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  const res = await api.post(`/destination/${id}/images`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data as Array<{ id: number; url: string; createdAt: string }>;
}

export async function deleteDestinationImage(imageId: number) {
  await api.delete(`/destination/images/${imageId}`);
}

// Admin
export async function createDestination(data: {
  name: string;
  slug: string;
  description?: string;
  featured?: boolean;
  categoryId?: number | null;
  price?: number | null;
  lat?: number | null;
  lng?: number | null;
}) {
  const res = await api.post('/destination', data);
  return res.data as Destination;
}

export async function getDestinationsPaged(
  page: number,
  pageSize: number,
  options?: {
    q?: string;
    categoryId?: string;
    categoryIds?: number[];
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    featured?: boolean;
  }
) {
  const res = await api.get('/destination', {
    params: { page, pageSize, ...(options || {}) },
  });
  return res.data as { items: Destination[]; total: number; page: number; pageSize: number };
}

export async function updateDestination(id: number, data: Partial<Destination>) {
  const res = await api.put(`/destination/${id}`, data);
  return res.data as Destination;
}

export async function deleteDestination(id: number) {
  await api.delete(`/destination/${id}`);
}

export async function bulkDeleteDestinations(ids: number[]) {
  await api.post('/destination/bulk-delete', { ids });
}