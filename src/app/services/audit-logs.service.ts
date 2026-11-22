import { request } from '@app/http/request';
import type { AuditLog } from '@app/types/audit-logs.type';
import type { PaginatedResponse } from '@app/types/response.type';
import type { SearchParams } from '@app/types/search.type';
import { searchParamsToQuery } from '@app/utils/url';

export const getAuditLogs = async (
  params?: SearchParams,
  signal?: AbortSignal,
  loader = true,
): Promise<PaginatedResponse<AuditLog>> => {
  const query = searchParamsToQuery({ ...params });
  const req = await request(`${import.meta.env.VITE_API}/audit-logs${query}`, {
    auth: true,
    loader,
    signal,
  });
  const res = await req.json();
  if (!req.ok) {
    throw res;
  }
  return res;
};
