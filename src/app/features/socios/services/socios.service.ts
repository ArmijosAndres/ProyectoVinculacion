/**
 * Socios Service
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Servicio para gestión de socios
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Socio,
  SocioListItem,
  SocioDetalle,
  SocioCreateRequest,
  SocioUpdateRequest,
  SocioFilters,
  SocioPaginatedResponse
} from '../../../core/models/socio.model';

@Injectable({
  providedIn: 'root'
})
export class SociosService {
  private readonly apiUrl = `${environment.apiUrl}/socios`;
  private http = inject(HttpClient);

  /**
   * Obtiene listado de socios con filtros y paginación
   */
  getSocios(filters: SocioFilters = {}): Observable<SocioPaginatedResponse> {
    let params = new HttpParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<SocioPaginatedResponse>(this.apiUrl, { params });
  }

  /**
   * Obtiene un socio por ID
   */
  getSocio(id: number): Observable<SocioDetalle> {
    return this.http.get<SocioDetalle>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene el perfil del socio autenticado
   */
  getMiPerfil(): Observable<SocioDetalle> {
    return this.http.get<SocioDetalle>(`${this.apiUrl}/mi-perfil`);
  }

  /**
   * Crea un nuevo socio
   */
  createSocio(data: SocioCreateRequest): Observable<Socio> {
    return this.http.post<Socio>(this.apiUrl, data);
  }

  /**
   * Actualiza un socio existente
   */
  updateSocio(id: number, data: SocioUpdateRequest): Observable<Socio> {
    return this.http.put<Socio>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Da de baja a un socio
   */
  darDeBaja(id: number, motivo: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/baja`, { motivo });
  }

  /**
   * Reactiva un socio dado de baja
   */
  reactivar(id: number): Observable<Socio> {
    return this.http.patch<Socio>(`${this.apiUrl}/${id}/reactivar`, {});
  }

  /**
   * Exporta listado de socios en PDF
   */
  exportPDF(filters: SocioFilters = {}): Observable<Blob> {
    let params = new HttpParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get(`${this.apiUrl}/export/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Exporta listado de socios en Excel
   */
  exportExcel(filters: SocioFilters = {}): Observable<Blob> {
    let params = new HttpParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get(`${this.apiUrl}/export/excel`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Busca socios por término
   */
  searchSocios(term: string): Observable<SocioListItem[]> {
    return this.http.get<SocioListItem[]>(`${this.apiUrl}/search`, {
      params: { q: term }
    });
  }
}
