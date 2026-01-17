import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { routes } from '../../app.routes';
import { reducers, metaReducers } from '../store/app.state';
import { httpErrorInterceptor } from '../interceptors/http-error.interceptor';
import { csrfInterceptor } from '../interceptors/csrf.interceptor';
import { environment } from '../../../environments/environment';
import { ProjectEffects } from '../../features/projects/store/project.effects';

/**
 * Application configuration providers
 * Centralized DI configuration following Angular best practices
 */
export const appConfigProviders: ApplicationConfig = {
  providers: [
    // Zone.js configuration for change detection optimization
    provideZoneChangeDetection({ 
      eventCoalescing: true,
      runCoalescing: true 
    }),
    
    // Router configuration
    provideRouter(routes),
    
    // HTTP Client with interceptors
    provideHttpClient(
      withInterceptors([
        httpErrorInterceptor,
        csrfInterceptor,
      ])
    ),
    
    // NgRx Store configuration
    provideStore(reducers, { metaReducers }),
    provideEffects([ProjectEffects]),
    provideRouterStore(),
    
    // Store DevTools (only in development)
    ...(environment.enableStoreDevTools && !environment.production
      ? [
          provideStoreDevtools({
            maxAge: 25,
            logOnly: environment.production,
          }),
        ]
      : []),
  ],
};
