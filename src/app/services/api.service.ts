import { request } from '@app/http/request';
import type { PaginatedResponse } from '@app/types/response.type';
import type { SearchParams } from '@app/types/search.type';
import { searchParamsToQuery } from '@app/utils/url';

export const getDummyProducts = async (search?: string) => {
  const req = await request(
    `${import.meta.env.VITE_DUMMY_API}/products/search${searchParamsToQuery({ q: search })}`,
  );
  const res = await req.json();
  if (!res.ok) {
    throw res;
  }
  return res?.products || [];
};

export const getDummyUser = async (id: string, loader = true) => {
  const req = await request(`${import.meta.env.VITE_DUMMY_API}/users/${id}`, {
    auth: true,
    loader,
  });
  const res = await req.json();
  if (!res.ok) {
    throw res;
  }
  return res;
};

export const getDummyUsers = async (
  params?: SearchParams,
  signal?: AbortSignal,
): Promise<PaginatedResponse<any>> => {
  const query = searchParamsToQuery({
    q: params?.search,
    skip: params?.skip || 0,
    limit: params?.limit || 10,
    sortBy: params?.sort,
    order: params?.order,
  });
  const req = await request(`${import.meta.env.VITE_DUMMY_API}/users${query}`, { signal });
  const res = await req.json();
  if (!res.ok) {
    throw res;
  }
  return {
    total: res.total,
    data: res.users,
  };
};
