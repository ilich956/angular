import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../models/user.model';

/**
 * User Service
 * Module 3: Typed HTTP Service
 * 
 * Uses the typed ApiService for type-safe API calls
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService = inject(ApiService);

  /**
   * Get all users
   */
  getUsers(): Observable<User[]> {
    // In a real app, this would call: return this.apiService.get<User[]>('users');
    // For demo purposes, returning mock data
    return of([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' as any, createdAt: new Date().toISOString() },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' as any, createdAt: new Date().toISOString() },
    ] as User[]).pipe(delay(500));
  }

  /**
   * Get user by ID
   */
  getUserById(id: number): Observable<User> {
    return this.apiService.get<User>(`users/${id}`);
  }

  /**
   * Create new user
   */
  createUser(user: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    // In a real app: return this.apiService.post<User>('users', user);
    return of({
      ...user,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    } as User).pipe(delay(500));
  }

  /**
   * Update user
   */
  updateUser(user: User): Observable<User> {
    return this.apiService.put<User>(`users/${user.id}`, user);
  }

  /**
   * Delete user
   */
  deleteUser(id: number): Observable<void> {
    return this.apiService.delete<void>(`users/${id}`);
  }
}
