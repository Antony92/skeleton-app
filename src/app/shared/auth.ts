import { request } from '@app/http/request';
import { Role, type User } from '@app/types/user.type';
import { atom } from 'nanostores';
import { navigate } from '@app/shared/navigation';

export const $user = atom<User>(null);

export const getUser = () => $user.get();

export const getAccessToken = () => $user.get()?.accessToken;

export const hasUserRole = (roles: string[]) => {
  const user = $user.get();
  return user?.roles.some((role) => roles.includes(role));
};

export const login = () => {
  // location.href = `${import.meta.env.VITE_API}/login`
  void dummyLogin({ username: 'emilys', password: 'emilyspass' });
};

export const logout = async () => {
  try {
    $user.set(null);
    const req = await request(`${import.meta.env.VITE_API}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    const res = await req.json();
    return res;
  } catch (error) {
    console.error('Logout failed: ', error);
  }
};

export const refreshTokenSilently = async () => {
  if (location.pathname === '/login') {
    return true;
  }
  try {
    const req = await fetch(`${import.meta.env.VITE_API}/auth/refresh`, { credentials: 'include' });
    if (!req.ok) return false;
    const user = await req.json();
    $user.set(user);
    return true;
  } catch (error) {
    console.error('Token refresh failed: ', error);
    return false;
  }
};

export const impersonate = async (username: string) => {
  try {
    const req = await request(`${import.meta.env.VITE_API}/auth/impersonate`, {
      method: 'POST',
      credentials: 'include',
      auth: true,
      json: true,
      body: JSON.stringify({ username }),
    });
    if (!req.ok) return false;
    const user = await req.json();
    $user.set(user);
    return true;
  } catch (error) {
    console.error('Impersonation failed: ', error);
    return false;
  }
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
    $user.set({
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
