import { request } from '@app/http/request';
import { setUser } from '@app/shared/auth';
import { navigate } from '@app/shared/navigation';
import type { PaginatedResponse } from '@app/types/response.type';
import type { SearchParams } from '@app/types/search.type';
import { Role } from '@app/types/user.type';
import { searchParamsToQuery } from '@app/utils/url';

export const getProducts = async (search?: string, limit = 10) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/products${searchParamsToQuery({ q: search, limit })}`);
		const res = await req.json();
		return res?.products || [];
	} catch (error) {
		console.error(error);
	}
	return [];
};

export const getProduct = async (id: string, loader = true) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/product/${id}`, { loader });
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

export const dummyLogin = async (user: { username: string; password: string }) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/auth/login`, {
			method: 'POST',
			auth: true,
			json: true,
			body: JSON.stringify(user),
			credentials: 'include',
		});
		const res = await req.json();
		setUser({
			id: res.id,
			username: res.email,
			name: `${res.firstName} ${res.lastName}`,
			roles: [Role.ADMIN],
			accessToken: res.accessToken,
		});
		navigate(localStorage.getItem('requested-page') || '/');
		localStorage.removeItem('requested-page');
	} catch (error) {
		console.error(error);
	}
};
