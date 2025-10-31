// src/services/destination.ts
import api from '../lib/api';

export type Destination = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  featured?: boolean;
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