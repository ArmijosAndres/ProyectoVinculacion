/**
 * Modelo de Usuario del Sistema CIMO
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

export interface User {
  id_usuario: number;
  id_rol: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: Date;
  estado: UserStatus;
  fecha_registro: Date;
  fecha_aprobacion?: Date;
  aprobado_por?: number;
  rol?: Role;
}

export interface Role {
  id_rol: number;
  nombre_rol: RoleName;
  descripcion?: string;
}

export type RoleName = 
  | 'presidente' 
  | 'vicepresidente' 
  | 'secretario' 
  | 'tesorero' 
  | 'vocal' 
  | 'socio' 
  | 'usuario';

export type UserStatus = 
  | 'pendiente' 
  | 'activo' 
  | 'inactivo' 
  | 'dado_de_baja';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface RegisterRequest {
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  password: string;
  password_confirmation: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Permisos por rol para control de acceso
 */
export const ROLE_PERMISSIONS: Record<RoleName, string[]> = {
  presidente: [
    'view_all_socios',
    'edit_all_socios',
    'delete_socios',
    'approve_registrations',
    'view_all_pagos',
    'approve_pagos',
    'generate_reports',
    'manage_system',
    'view_dashboard'
  ],
  vicepresidente: [
    'view_all_socios',
    'edit_all_socios',
    'approve_registrations',
    'view_all_pagos',
    'generate_reports',
    'view_dashboard'
  ],
  secretario: [
    'view_all_socios',
    'edit_all_socios',
    'approve_registrations',
    'generate_reports',
    'view_dashboard'
  ],
  tesorero: [
    'view_all_socios',
    'view_all_pagos',
    'approve_pagos',
    'generate_reports',
    'view_dashboard'
  ],
  vocal: [
    'view_all_socios',
    'view_dashboard'
  ],
  socio: [
    'view_own_profile',
    'edit_own_profile',
    'view_own_pagos',
    'upload_comprobante'
  ],
  usuario: [
    'view_requirements',
    'submit_registration'
  ]
};

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: RoleName, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Verifica si un rol pertenece a la directiva
 */
export function isDirectiva(role: RoleName): boolean {
  const directivaRoles: RoleName[] = ['presidente', 'vicepresidente', 'secretario', 'tesorero', 'vocal'];
  return directivaRoles.includes(role);
}
