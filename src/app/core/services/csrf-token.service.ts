import { Injectable } from '@angular/core';

/**
 * CSRF Token Service
 * Manages CSRF tokens for secure API communication
 * 
 * Manages CSRF tokens for secure API requests
 */
@Injectable({
  providedIn: 'root',
})
export class CsrfTokenService {
  private tokenKey = 'csrf-token';

  /**
   * Get CSRF token from storage or cookie
   */
  getToken(): string | null {
    // In a real application, this would:
    // 1. Check if token exists in memory
    // 2. Fall back to cookie or localStorage
    // 3. Request new token from server if needed
    
    // For demo purposes, returning from localStorage
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Set CSRF token
   */
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Clear CSRF token
   */
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
