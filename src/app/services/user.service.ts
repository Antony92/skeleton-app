import { request } from '@app/http/request';
import type { ArrayResponse, GenericResponse, PaginatedResponse } from '@app/types/response.type';
import type { SearchParams } from '@app/types/search.type';
import { searchParamsToQuery } from '@app/utils/url';
import type { DbUser } from '@app/types/user.type';

export const getUsers = async (
  params?: SearchParams,
  signal?: AbortSignal,
  loader = true,
): Promise<PaginatedResponse<DbUser>> => {
  const query = searchParamsToQuery({ ...params });
  const req = await request(`${import.meta.env.VITE_API}/users${query}`, {
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

export const createUser = async (user: {
  name: string;
  username: string;
  roles?: string[];
}): Promise<GenericResponse<DbUser>> => {
  const req = await request(`${import.meta.env.VITE_API}/user`, {
    method: 'POST',
    auth: true,
    json: true,
    body: JSON.stringify(user),
  });
  const res = await req.json();
  if (!req.ok) {
    throw res;
  }
  return res;
};

export const updateUser = async (user: {
  id: string;
  name?: string;
  username?: string;
  roles?: string[];
  blocked?: boolean;
}): Promise<GenericResponse<DbUser>> => {
  const req = await request(`${import.meta.env.VITE_API}/user/${user.id}`, {
    method: 'PUT',
    auth: true,
    json: true,
    body: JSON.stringify(user),
  });
  const res = await req.json();
  if (!req.ok) {
    throw res;
  }
  return res;
};

export const deleteUser = async (id: string): Promise<GenericResponse<DbUser>> => {
  const req = await request(`${import.meta.env.VITE_API}/user/${id}`, {
    method: 'DELETE',
    auth: true,
  });
  const res = await req.json();
  if (!req.ok) {
    throw res;
  }
  return res;
};

export const getRoles = async (): Promise<ArrayResponse<string>> => {
  const req = await request(`${import.meta.env.VITE_API}/roles`, { auth: true });
  const res = await req.json();
  if (!req.ok) {
    throw res;
  }
  return res;
};

export const getMe = async (): Promise<GenericResponse<DbUser>> => {
  const req = await request(`${import.meta.env.VITE_API}/me`, {
    auth: true,
  });
  const res = await req.json();
  if (!req.ok) {
    throw res;
  }
  return res;
};
