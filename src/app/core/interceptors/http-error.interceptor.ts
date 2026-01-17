import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, throwError, timer } from 'rxjs';
import { ErrorHandlingService } from '../services/error-handling.service';

/**
 * HTTP Error Interceptor
 * Centralized error handling with automatic retry mechanism
 * 
 * Features:
 * - Automatic retry for transient errors (3 retries with exponential backoff)
 * - Centralized error handling
 * - Error logging and notification
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandlingService = inject(ErrorHandlingService);
  
  return next(req).pipe(
    retry({
      count: 3,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Retry only for 5xx errors (server errors) or network errors
        if (
          error.status >= 500 ||
          error.status === 0 ||
          error.status === 408 // Request Timeout
        ) {
          // Exponential backoff: 1s, 2s, 4s
          return timer(1000 * Math.pow(2, retryCount - 1));
        }
        // Don't retry for other errors
        throw error;
      },
    }),
    catchError((error: HttpErrorResponse) => {
      // Centralized error handling
      errorHandlingService.handleError(error);
      return throwError(() => error);
    })
  );
};
