// Global Types & RBAC Definitions

export type UserRole = 'ADMIN' | 'SEKRETARIS' | 'BENDAHARA' | 'GEMBALA' | 'JEMAAT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}