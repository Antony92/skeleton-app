export type AuditLog = {
  id: string;
  username: string;
  name: string;
  action: string;
  target: string;
  data?: unknown;
  message?: string;
  impersonated?: string;
  created: string;
};
