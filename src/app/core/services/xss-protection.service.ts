import { Injectable, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

/**
 * XSS Protection Service
 * Sanitizes user input to prevent XSS attacks
 * 
 * Prevents XSS attacks by sanitizing user input and HTML content
 */
@Injectable({
  providedIn: 'root',
})
export class XssProtectionService {
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * Sanitize HTML content to prevent XSS
   */
  sanitizeHtml(html: string): SafeHtml {
    // First use DOMPurify for comprehensive sanitization
    const purified = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target'],
    });
    
    // Then use Angular's DomSanitizer for additional safety
    return this.sanitizer.sanitize(1, purified) as SafeHtml; // SecurityContext.HTML = 1
  }

  /**
   * Sanitize plain text (remove any HTML tags)
   */
  sanitizeText(text: string): string {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  }

  /**
   * Check if string contains potentially dangerous content
   */
  isSafe(input: string): boolean {
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // Event handlers like onclick=
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(input));
  }
}
