import { useQuery } from '@tanstack/react-query';
import { auditLogService } from '../services/auditLogService';

export function useAuditLogs() {
  return useQuery({ queryKey: ['audit-logs'], queryFn: auditLogService.getLogs });
}

export function useAuditCategories() {
  return useQuery({ queryKey: ['audit-logs', 'categories'], queryFn: auditLogService.getCategories });
}
