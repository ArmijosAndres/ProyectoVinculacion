/**
 * Modelo de Socio del Sistema CIMO
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { User } from './user.model';

export interface Socio {
  id_socio: number;
  id_usuario: number;
  numero_socio: string;
  fecha_ingreso: Date;
  fecha_baja?: Date;
  motivo_baja?: string;
  tipo_membresia: TipoMembresia;
  cuota_mensual: number;
  observaciones?: string;
  usuario?: User;
  // Campos adicionales para visualización
  titulo?: string;
  maestrias?: string[];
  universidad?: string;
  cargo?: string;
  funcion?: string;
  foto_url?: string;
}

export type TipoMembresia = 
  | 'regular' 
  | 'honorario' 
  | 'fundador' 
  | 'vitalicio';

export interface SocioListItem {
  id_socio: number;
  numero_socio: string;
  cedula: string;
  nombre_completo: string;
  email: string;
  telefono?: string;
  estado: string;
  tipo_membresia: TipoMembresia;
  cargo?: string;
  funcion?: string;
  foto_url?: string;
  fecha_ingreso: Date;
  total_pagos_realizados: number;
}

export interface SocioDetalle extends Socio {
  historial_pagos?: PagoResumen[];
  estadisticas?: SocioEstadisticas;
}

export interface PagoResumen {
  id_pago: number;
  mes: number;
  anio: number;
  monto: number;
  fecha_pago: Date;
  estado_pago: string;
}

export interface SocioEstadisticas {
  total_pagado: number;
  meses_activo: number;
  ultimo_pago?: Date;
  pagos_pendientes: number;
}

export interface SocioCreateRequest {
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  titulo?: string;
  maestrias?: string[];
  universidad?: string;
  cargo?: string;
  funcion?: string;
  tipo_membresia?: TipoMembresia;
  cuota_mensual?: number;
  observaciones?: string;
}

export interface SocioUpdateRequest {
  nombres?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  titulo?: string;
  maestrias?: string[];
  universidad?: string;
  cargo?: string;
  funcion?: string;
  tipo_membresia?: TipoMembresia;
  cuota_mensual?: number;
  observaciones?: string;
}

export interface SocioFilters {
  estado?: string;
  tipo_membresia?: TipoMembresia;
  cargo?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface SocioPaginatedResponse {
  data: SocioListItem[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}
