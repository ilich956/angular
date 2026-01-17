import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CsrfTokenService } from '../services/csrf-token.service';

/**
 * CSRF Protection Interceptor
 * Adds CSRF tokens to mutating HTTP requests
 * 
 * Adds CSRF token to all mutating HTTP requests (POST, PUT, DELETE, PATCH)
 */
export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfTokenService = inject(CsrfTokenService);
  
  // Only add CSRF token for mutating requests
  const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  
  if (mutatingMethods.includes(req.method.toUpperCase())) {
    const csrfToken = csrfTokenService.getToken();
    if (csrfToken) {
      // Clone the request and add CSRF token header
      const clonedReq = req.clone({
        setHeaders: {
          'X-CSRF-Token': csrfToken,
        },
      });
      return next(clonedReq);
    }
  }
  
  return next(req);
};
