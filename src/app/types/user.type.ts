export type User = {
  id: string;
  name: string;
  username: string;
  roles: string[];
  impersonated?: string;
  accessToken?: string;
} | null;

export const Role = {
  GUEST: 'guest',
  ADMIN: 'admin',
} as const;
