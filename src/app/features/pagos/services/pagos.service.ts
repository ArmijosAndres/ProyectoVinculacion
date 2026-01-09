/**
 * Pagos Service
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Servicio para gestión de pagos y mensualidades
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Pago, 
  MisMensualidades, 
  PagoCreateRequest, 
  PagoApprovalRequest,
  PagoFilters,
  PagoPaginatedResponse,
  ReporteMensualidades 
} from '../../../core/models/pago.model';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private readonly apiUrl = `${environment.apiUrl}/pagos`;
  private http = inject(HttpClient);

  /**
   * Obtiene las mensualidades del usuario autenticado
   */
  getMisMensualidades(anio: number): Observable<MisMensualidades> {
    return this.http.get<MisMensualidades>(`${this.apiUrl}/mis-mensualidades`, {
      params: { anio: anio.toString() }
    });
  }

  /**
   * Obtiene listado de pagos con filtros
   */
  getPagos(filters: PagoFilters = {}): Observable<PagoPaginatedResponse> {
    let params = new HttpParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PagoPaginatedResponse>(this.apiUrl, { params });
  }

  /**
   * Obtiene un pago por ID
   */
  getPago(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.apiUrl}/${id}`);
  }

  /**
   * Registra un nuevo pago
   */
  createPago(pago: PagoCreateRequest): Observable<Pago> {
    const formData = new FormData();
    
    Object.entries(pago).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return this.http.post<Pago>(this.apiUrl, formData);
  }

  /**
   * Aprueba o rechaza un pago
   */
  approvePago(data: PagoApprovalRequest): Observable<Pago> {
    return this.http.patch<Pago>(`${this.apiUrl}/${data.id_pago}/approve`, {
      estado_pago: data.estado_pago,
      observaciones: data.observaciones
    });
  }

  /**
   * Obtiene pagos pendientes de aprobación
   */
  getPagosPendientes(page: number = 1): Observable<PagoPaginatedResponse> {
    return this.getPagos({ estado_pago: 'pendiente', page });
  }

  /**
   * Obtiene reporte de mensualidades
   */
  getReporteMensualidades(anio: number): Observable<ReporteMensualidades> {
    return this.http.get<ReporteMensualidades>(`${this.apiUrl}/reporte`, {
      params: { anio: anio.toString() }
    });
  }

  /**
   * Descarga reporte en PDF
   */
  downloadReportePDF(anio: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reporte/pdf`, {
      params: { anio: anio.toString() },
      responseType: 'blob'
    });
  }

  /**
   * Descarga reporte en Excel
   */
  downloadReporteExcel(anio: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reporte/excel`, {
      params: { anio: anio.toString() },
      responseType: 'blob'
    });
  }
}
