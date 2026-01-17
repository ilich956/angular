/**
 * User Model
 * Type-safe model definitions for the Users feature
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export interface UserFilters {
  role?: UserRole;
  search?: string;
}
