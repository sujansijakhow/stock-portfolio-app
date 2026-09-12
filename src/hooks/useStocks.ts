import { useQuery } from '@tanstack/react-query';
import { fetchStocks } from '../api/stockApi';

export const useStocks = () =>
  useQuery({
    queryKey: ['stocks'],
    queryFn: fetchStocks,
  });