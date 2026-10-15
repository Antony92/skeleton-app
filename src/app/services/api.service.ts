import { request } from '@app/http/request';
import type { PaginatedResponse } from '@app/types/response.type';
import type { SearchParams } from '@app/types/search.type';
import { searchParamsToQuery } from '@app/utils/url';

export const getProducts = async (search?: string) => {
  try {
    const req = await request(
      `${import.meta.env.VITE_API}/products/search${searchParamsToQuery({ q: search })}`,
    );
    const res = await req.json();
    return res?.products || [];
  } catch (error) {
    console.error(error);
  }
  return [];
};

export const getUser = async (id: string, loader = true) => {
  try {
    const req = await request(`${import.meta.env.VITE_API}/users/${id}`, { auth: true, loader });
    const res = await req.json();
    return res;
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const getUsers = async (params?: SearchParams): Promise<PaginatedResponse<any>> => {
  try {
    const query = searchParamsToQuery({
      q: params?.search,
      skip: params?.skip || 0,
      limit: params?.limit || 10,
      sortBy: params?.sort,
      order: params?.order,
    });
    const req = await request(`${import.meta.env.VITE_API}/users${query}`);
    const res = await req.json();
    return {
      total: res.total,
      data: res.users,
    };
  } catch (error) {
    console.error(error);
  }
  return {
    total: 0,
    data: [],
  };
};
