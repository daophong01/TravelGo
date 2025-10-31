// src/services/destination.ts
import api from '../lib/api';

export type Destination = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  featured?: boolean;
  categoryId?: number | null;
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

// Admin
export async function createDestination(data: {
  name: string;
  slug: string;
  description?: string;
  featured?: boolean;
  categoryId?: number | null;
}) {
  const res = await api.post('/destination', data);
  return res.data as Destination;
}

export async function getDestinationsPaged(page: number, pageSize: number) {
  const res = await api.get('/destination', { params: { page, pageSize } });
  return res.data as { items: Destination[]; total: number; page: number; pageSize: number };
}

export async function updateDestination(id: number, data: Partial<Destination>) {
  const res = await api.put(`/destination/${id}`, data);
  return res.data as Destination;
}

export async function deleteDestination(id: number) {
  await api.delete(`/destination/${id}`);
}