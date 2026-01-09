/**
 * Application Configuration
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Configuración principal de la aplicación Angular
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Change detection zoneless para mejor rendimiento
    provideZonelessChangeDetection(),
    
    // Router con transiciones de vista
    provideRouter(routes, withViewTransitions()),
    
    // HTTP Client con interceptors
    provideHttpClient(
      withInterceptors([
        jwtInterceptor,
        errorInterceptor
      ])
    )
  ]
};
