/**
 * Auth Guard - Control de Acceso por Autenticación
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Protege rutas que requieren autenticación
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { inject } from '@angular/core';
import { 
  CanActivateFn, 
  CanActivateChildFn,
  Router, 
  ActivatedRouteSnapshot,
  RouterStateSnapshot 
} from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard que verifica si el usuario está autenticado
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Guardar la URL intentada para redirección post-login
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};

/**
 * Guard para rutas hijas
 */
export const authChildGuard: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return authGuard(childRoute, state);
};

/**
 * Guard que verifica si el usuario NO está autenticado
 * (para rutas como login/register)
 */
export const guestGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  // Si ya está autenticado, redirigir a la página principal según rol
  const role = authService.getRole();
  
  if (role && ['presidente', 'vicepresidente', 'secretario', 'tesorero', 'vocal'].includes(role)) {
    router.navigate(['/dashboard']);
  } else {
    router.navigate(['/mis-mensualidades']);
  }
  
  return false;
};
