import type { TemplateResult } from 'lit';

export type TableColumn<T = unknown> = {
  header: string;
  field: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'select' | 'select-multiple';
  value?: string;
  list?: { label: string; value: string | boolean | number }[];
  order?: 'desc' | 'asc' | null;
  hidden?: boolean;
  default?: boolean;
  textlimit?: boolean;
  freezable?: boolean;
  frozen?: boolean;
  render?: (value: T) => TemplateResult;
};

export type TableHeaderFilter = {
  field: string;
  value: string;
  order: 'desc' | 'asc' | null;
  type: 'order' | 'value';
};
