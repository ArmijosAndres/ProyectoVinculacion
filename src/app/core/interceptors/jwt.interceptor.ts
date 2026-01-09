/**
 * JWT Interceptor - Inyección Automática de Token
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Intercepta todas las peticiones HTTP y añade el token JWT
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Interceptor funcional para inyección de JWT
 */
export const jwtInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Obtener el token actual
  const token = authService.getToken();
  
  // Solo añadir token a peticiones a nuestra API
  if (token && isApiRequest(request.url)) {
    request = addTokenHeader(request, token);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error es 401 (no autorizado), cerrar sesión
      if (error.status === 401 && isApiRequest(request.url)) {
        handleUnauthorized(authService, router);
      }
      
      return throwError(() => error);
    })
  );
};

/**
 * Verifica si la URL pertenece a nuestra API
 */
function isApiRequest(url: string): boolean {
  return url.startsWith(environment.apiUrl);
}

/**
 * Añade el header de autorización a la petición
 */
function addTokenHeader(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': getContentType(request),
      'Accept': 'application/json'
    }
  });
}

/**
 * Determina el Content-Type apropiado
 */
function getContentType(request: HttpRequest<unknown>): string {
  // Si es FormData (upload de archivos), no establecer Content-Type
  if (request.body instanceof FormData) {
    return ''; // El navegador establecerá automáticamente multipart/form-data
  }
  return 'application/json';
}

/**
 * Maneja errores 401 (no autorizado)
 */
function handleUnauthorized(authService: AuthService, router: Router): void {
  // Limpiar datos de autenticación sin hacer petición al servidor
  localStorage.removeItem('cimo_auth_token');
  localStorage.removeItem('cimo_user_data');
  localStorage.removeItem('cimo_token_expiry');
  
  // Redirigir a login
  router.navigate(['/login'], {
    queryParams: { 
      sessionExpired: 'true' 
    }
  });
}
