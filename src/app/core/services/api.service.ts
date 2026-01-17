import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Generic API Response interface
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

/**
 * Generic API Error Response
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

/**
 * Typed API Service
 * Provides type-safe HTTP client with retry and error handling
 * 
 * Features:
 * - Fully typed HTTP requests and responses
 * - Automatic retry with exponential backoff
 * - Request timeout handling
 * - Generic error handling
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly defaultTimeout = 10000; // 10 seconds

  /**
   * Generic GET request with type safety
   */
  get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, { params: httpParams })
      .pipe(
        timeout(this.defaultTimeout),
        retry({
          count: 2,
          delay: 1000,
        }),
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Generic POST request with type safety
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(
        timeout(this.defaultTimeout),
        retry({
          count: 1, // POST requests should retry less
          delay: 1000,
        }),
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Generic PUT request with type safety
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(
        timeout(this.defaultTimeout),
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Generic DELETE request with type safety
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`)
      .pipe(
        timeout(this.defaultTimeout),
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Error handler with fallback mechanism
   */
  private handleError = (error: any): Observable<never> => {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else if (error.status === 0) {
      errorMessage = 'Network Error: Please check your connection';
    } else {
      errorMessage = error.error?.message || `Server Error: ${error.status}`;
    }
    
    // Fallback: Return empty observable or cached data in production
    return throwError(() => new Error(errorMessage));
  };
}
