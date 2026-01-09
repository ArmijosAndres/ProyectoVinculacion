/**
 * Modelo de Pago/Mensualidad del Sistema CIMO
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

export interface Pago {
  id_pago: number;
  id_socio: number;
  mes: number;
  anio: number;
  monto: number;
  fecha_pago: Date;
  fecha_registro: Date;
  metodo_pago?: MetodoPago;
  numero_comprobante?: string;
  comprobante_url?: string;
  estado_pago: EstadoPago;
  observaciones?: string;
  registrado_por?: number;
  aprobado_por?: number;
  fecha_aprobacion?: Date;
  // Campos de relación para visualización
  socio_nombre?: string;
  socio_numero?: string;
  aprobador_nombre?: string;
}

export type MetodoPago = 
  | 'efectivo' 
  | 'transferencia' 
  | 'deposito' 
  | 'tarjeta';

export type EstadoPago = 
  | 'pendiente' 
  | 'aprobado' 
  | 'rechazado';

export interface MisMensualidades {
  socio: {
    id_socio: number;
    numero_socio: string;
    nombre_completo: string;
    cuota_mensual: number;
  };
  resumen: {
    total_pagado: number;
    pagos_pendientes: number;
    ultimo_pago?: Date;
    proximo_vencimiento?: Date;
  };
  mensualidades: MensualidadDetalle[];
}

export interface MensualidadDetalle {
  mes: number;
  anio: number;
  mes_nombre: string;
  monto_esperado: number;
  monto_pagado?: number;
  fecha_pago?: Date;
  estado: 'pagado' | 'pendiente' | 'vencido' | 'en_revision';
  comprobante_url?: string;
  id_pago?: number;
}

export interface PagoCreateRequest {
  id_socio?: number; // Opcional si el usuario es socio
  mes: number;
  anio: number;
  monto: number;
  fecha_pago: string;
  metodo_pago: MetodoPago;
  numero_comprobante?: string;
  comprobante?: File;
  observaciones?: string;
}

export interface PagoApprovalRequest {
  id_pago: number;
  estado_pago: 'aprobado' | 'rechazado';
  observaciones?: string;
}

export interface PagoFilters {
  id_socio?: number;
  mes?: number;
  anio?: number;
  estado_pago?: EstadoPago;
  fecha_desde?: string;
  fecha_hasta?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PagoPaginatedResponse {
  data: Pago[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

export interface ReporteMensualidades {
  periodo: {
    anio: number;
    mes_inicio: number;
    mes_fin: number;
  };
  totales: {
    total_esperado: number;
    total_recaudado: number;
    total_pendiente: number;
    porcentaje_recaudacion: number;
  };
  por_mes: ReporteMensual[];
}

export interface ReporteMensual {
  mes: number;
  anio: number;
  mes_nombre: string;
  total_socios: number;
  pagos_realizados: number;
  pagos_pendientes: number;
  monto_esperado: number;
  monto_recaudado: number;
  porcentaje: number;
}

/**
 * Obtiene el nombre del mes en español
 */
export function getNombreMes(mes: number): string {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[mes - 1] || '';
}

/**
 * Genera lista de meses para selector
 */
export function getMesesSelector(): { value: number; label: string }[] {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: getNombreMes(i + 1)
  }));
}

/**
 * Genera lista de años para selector (desde 2024 hasta año actual + 1)
 */
export function getAniosSelector(): number[] {
  const anioActual = new Date().getFullYear();
  const anios: number[] = [];
  for (let i = 2024; i <= anioActual + 1; i++) {
    anios.push(i);
  }
  return anios;
}
