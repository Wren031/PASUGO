import { mockDelay } from '@/utils/mock';
import { cancellationReasons, peakHours, popularRoutes, summaries, weeklyTrend } from '../mock/data';
import type { ReportDataset, ReportTimeframe } from '../types';

export const reportsService = {
  async getReport(timeframe: ReportTimeframe): Promise<ReportDataset> {
    await mockDelay(450);
    return {
      timeframe,
      summary: summaries[timeframe],
      bookingTrend: weeklyTrend,
      popularRoutes,
      peakHours,
      cancellationReasons,
    };
  },

  async exportReport(_timeframe: ReportTimeframe, format: 'pdf' | 'excel' | 'csv'): Promise<{ file: string; format: string; size: string }> {
    await mockDelay(900);
    const size = format === 'pdf' ? '2.4 MB' : format === 'excel' ? '1.1 MB' : '420 KB';
    return { file: `hatodgo-report-${_timeframe}-${Date.now()}.${format}`, format, size };
  },
};
