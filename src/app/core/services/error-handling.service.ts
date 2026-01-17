import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Error Handling Service
 * Centralized error logging and notification service
 * 
 * Handles application-wide error logging, notification, and recovery
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  /**
   * Handle HTTP errors
   */
  handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: Invalid data provided';
          break;
        case 401:
          errorMessage = 'Unauthorized: Please log in';
          break;
        case 403:
          errorMessage = 'Forbidden: Access denied';
          break;
        case 404:
          errorMessage = 'Not Found: Resource not available';
          break;
        case 500:
          errorMessage = 'Server Error: Please try again later';
          break;
        default:
          errorMessage = `Server Error: ${error.status} ${error.statusText}`;
      }
    }
    
    // Log error (in production, this would send to error tracking service)
    console.error('Error handled:', {
      message: errorMessage,
      error,
      timestamp: new Date().toISOString(),
    });
    
    // TODO: Show user-friendly notification
    // In a real app, inject a notification service here
  }

  /**
   * Handle application errors (non-HTTP)
   */
  handleApplicationError(error: Error): void {
    console.error('Application error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }
}
