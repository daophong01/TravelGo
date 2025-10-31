// src/hooks/useDestinations.ts
import { useQuery } from '@tanstack/react-query';
import { getDestinations, getFeaturedDestinations } from '../services/destination';

export function useDestinations() {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations,
  });
}

export function useFeaturedDestinations() {
  return useQuery({
    queryKey: ['destinations', 'featured'],
    queryFn: getFeaturedDestinations,
  });
}