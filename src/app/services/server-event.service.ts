import { request } from '@app/http/request';

export const getServerEvents = async () => {
  const req = await request(`${import.meta.env.VITE_API}/server-events`, { auth: true });
  const res = await req.json();
  if (!req.ok) {
    throw res;
  }
  return res;
};

export const createServerEvent = async (event: {
  type: 'info' | 'warning' | 'error';
  message: string;
}) => {
  const req = await request(`${import.meta.env.VITE_API}/server-event`, {
    method: 'POST',
    auth: true,
    json: true,
    body: JSON.stringify(event),
  });
  const res = await req.json();
  if (!req.ok) {
    throw res;
  }
  return res;
};

export const updateServerEvent = async (event: {
  id: string;
  type?: 'info' | 'warning' | 'error';
  message?: string;
}) => {
  const req = await request(`${import.meta.env.VITE_API}/server-event/${event.id}`, {
    method: 'PATCH',
    auth: true,
    json: true,
    body: JSON.stringify(event),
  });
  const res = await req.json();
  if (!req.ok) {
    throw res;
  }
  return res;
};

export const deleteServerEvent = async (id: string) => {
  const req = await request(`${import.meta.env.VITE_API}/server-event/${id}`, {
    method: 'DELETE',
    auth: true,
  });
  const res = await req.json();
  if (!req.ok) {
    throw res;
  }
  return res;
};
