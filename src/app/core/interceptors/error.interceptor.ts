/**
 * Error Interceptor - Manejo Centralizado de Errores HTTP
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Intercepta errores HTTP y proporciona manejo uniforme
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: Date;
}

/**
 * Interceptor funcional para manejo de errores
 */
export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const notificationService = inject(NotificationService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError = parseError(error);
      
      // No mostrar notificación para errores 401 (manejados por jwtInterceptor)
      if (error.status !== 401) {
        handleErrorNotification(apiError, notificationService);
      }
      
      return throwError(() => apiError);
    })
  );
};

/**
 * Parsea el error HTTP a un formato consistente
 */
function parseError(error: HttpErrorResponse): ApiError {
  const apiError: ApiError = {
    status: error.status,
    message: 'Ha ocurrido un error inesperado',
    timestamp: new Date()
  };

  // Error de red
  if (error.status === 0) {
    apiError.message = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
    return apiError;
  }

  // Errores del servidor
  switch (error.status) {
    case 400:
      apiError.message = error.error?.message || 'Solicitud inválida';
      apiError.errors = error.error?.errors;
      break;
    
    case 401:
      apiError.message = 'Sesión expirada o credenciales inválidas';
      break;
    
    case 403:
      apiError.message = 'No tiene permisos para realizar esta acción';
      break;
    
    case 404:
      apiError.message = error.error?.message || 'Recurso no encontrado';
      break;
    
    case 422:
      apiError.message = 'Error de validación';
      apiError.errors = error.error?.errors;
      break;
    
    case 429:
      apiError.message = 'Demasiadas solicitudes. Por favor espere un momento.';
      break;
    
    case 500:
      apiError.message = 'Error interno del servidor. Intente más tarde.';
      break;
    
    case 502:
    case 503:
    case 504:
      apiError.message = 'Servicio temporalmente no disponible. Intente más tarde.';
      break;
    
    default:
      if (error.error?.message) {
        apiError.message = error.error.message;
      }
  }

  return apiError;
}

/**
 * Muestra notificación según el tipo de error
 */
function handleErrorNotification(error: ApiError, notification: NotificationService): void {
  // Errores de validación se muestran de forma diferente
  if (error.status === 422 && error.errors) {
    const firstError = Object.values(error.errors)[0]?.[0];
    if (firstError) {
      notification.error(firstError);
      return;
    }
  }

  // Errores críticos del servidor
  if (error.status >= 500) {
    notification.error(error.message, 'Error del Servidor');
    return;
  }

  // Otros errores
  notification.error(error.message);
}
