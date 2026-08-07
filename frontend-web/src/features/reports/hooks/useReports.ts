import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reportsService } from '../services/reportsService';
import type { ReportTimeframe } from '../types';

export function useReport(timeframe: ReportTimeframe) {
  return useQuery({
    queryKey: ['reports', timeframe],
    queryFn: () => reportsService.getReport(timeframe),
  });
}

export function useExportReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ timeframe, format }: { timeframe: ReportTimeframe; format: 'pdf' | 'excel' | 'csv' }) =>
      reportsService.exportReport(timeframe, format),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
