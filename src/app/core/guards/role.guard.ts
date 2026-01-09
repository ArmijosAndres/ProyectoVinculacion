/**
 * Role Guard - Control de Acceso por Rol
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Protege rutas basándose en roles de usuario
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { inject } from '@angular/core';
import { 
  CanActivateFn, 
  Router, 
  ActivatedRouteSnapshot 
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleName } from '../models/user.model';

/**
 * Guard que verifica si el usuario tiene los roles requeridos
 * 
 * Uso en rutas:
 * {
 *   path: 'socios',
 *   component: SociosComponent,
 *   canActivate: [roleGuard],
 *   data: { roles: ['presidente', 'vicepresidente', 'secretario'] }
 * }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Primero verificar autenticación
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Obtener roles permitidos de la configuración de la ruta
  const requiredRoles = route.data['roles'] as RoleName[] | undefined;
  
  // Si no hay roles configurados, permitir acceso
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Verificar si el usuario tiene alguno de los roles requeridos
  const userRole = authService.getRole();
  
  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  // Usuario no tiene permisos, redirigir a página de acceso denegado
  router.navigate(['/unauthorized']);
  return false;
};

/**
 * Guard específico para la directiva (presidente, vicepresidente, secretario, tesorero, vocal)
 */
export const directivaGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (authService.isDirectiva()) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};

/**
 * Guard específico para funciones de tesorería
 */
export const tesoreriaGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles: RoleName[] = ['presidente', 'tesorero'];
  const userRole = authService.getRole();

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};

/**
 * Guard específico para administración de socios
 */
export const adminSociosGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles: RoleName[] = ['presidente', 'vicepresidente', 'secretario'];
  const userRole = authService.getRole();

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
