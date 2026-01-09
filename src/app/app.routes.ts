/**
 * Application Routes
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Definición de rutas con guards de autenticación y roles
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { roleGuard, directivaGuard, tesoreriaGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // ============================================
  // RUTAS PÚBLICAS (Solo usuarios no autenticados)
  // ============================================
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login.component')
      .then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/components/register.component')
      .then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },

  // ============================================
  // RUTAS PROTEGIDAS (Requieren autenticación)
  // ============================================
  
  // Dashboard - Solo directiva
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/components/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard, directivaGuard]
  },

  // Mis Mensualidades - Todos los socios autenticados
  {
    path: 'mis-mensualidades',
    loadComponent: () => import('./features/pagos/components/mis-mensualidades.component')
      .then(m => m.MisMensualidadesComponent),
    canActivate: [authGuard],
    data: { roles: ['presidente', 'vicepresidente', 'secretario', 'tesorero', 'vocal', 'socio'] }
  },

  // Gestión de Socios - Solo directiva
  {
    path: 'socios',
    loadComponent: () => import('./features/socios/components/listado-socios.component')
      .then(m => m.ListadoSociosComponent),
    canActivate: [authGuard, directivaGuard]
  },

  // Registrar Pago - Todos los socios
  {
    path: 'pagos/registrar',
    loadComponent: () => import('./features/pagos/components/registrar-pago.component')
      .then(m => m.RegistrarPagoComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['presidente', 'vicepresidente', 'secretario', 'tesorero', 'vocal', 'socio'] }
  },

  // Aprobar Pagos - Solo tesorería (presidente y tesorero)
  {
    path: 'pagos/aprobar',
    loadComponent: () => import('./features/pagos/components/aprobar-pagos.component')
      .then(m => m.AprobarPagosComponent),
    canActivate: [authGuard, tesoreriaGuard]
  },

  // Reportes - Directiva excepto vocal
  {
    path: 'reportes',
    loadComponent: () => import('./features/reportes/components/reportes.component')
      .then(m => m.ReportesComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['presidente', 'vicepresidente', 'secretario', 'tesorero'] }
  },

  // Mi Perfil - Todos los usuarios autenticados
  {
    path: 'perfil',
    loadComponent: () => import('./features/perfil/components/mi-perfil.component')
      .then(m => m.MiPerfilComponent),
    canActivate: [authGuard]
  },

  // Página no autorizada
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized.component')
      .then(m => m.UnauthorizedComponent)
  },

  // ============================================
  // REDIRECCIONES
  // ============================================
  {
    path: '',
    redirectTo: 'mis-mensualidades',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'mis-mensualidades'
  }
];
