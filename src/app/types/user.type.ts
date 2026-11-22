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

export type DbUser = {
  id: string;
  name: string;
  username: string;
  roles: string[];
  active: boolean;
  blocked: boolean;
  internal: boolean;
  created: string;
  updated?: string;
  lastLogin?: string;
};
