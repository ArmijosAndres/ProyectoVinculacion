/**
 * Listado Socios Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Vista de listado de socios para la directiva
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SocioListItem, SocioFilters } from '../../../core/models/socio.model';
import { SociosService } from '../services/socios.service';
import { ModalSocioComponent } from './modal-socio.component';

@Component({
  selector: 'app-listado-socios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalSocioComponent],
  template: `
    <div class="row">
      <div class="col-12">
        <div class="card border shadow-xs mb-4">
          <!-- Header -->
          <div class="card-header border-bottom pb-0">
            <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3">
              <div class="mb-3 mb-md-0">
                <h6 class="font-weight-semibold text-lg mb-0">
                  <i class="fas fa-users me-2"></i>
                  Socios CIMO
                </h6>
                <p class="text-sm text-muted mb-0">
                  {{ totalSocios() }} socios registrados
                </p>
              </div>
              
              <div class="d-flex gap-2">
                <!-- Búsqueda -->
                <div class="input-group input-group-sm" style="width: 250px;">
                  <span class="input-group-text bg-white border-end-0">
                    <i class="fas fa-search text-muted"></i>
                  </span>
                  <input 
                    type="text" 
                    class="form-control border-start-0"
                    placeholder="Buscar socio..."
                    [(ngModel)]="searchTerm"
                    (input)="onSearch()">
                </div>

                <!-- Filtro Estado -->
                <select 
                  class="form-select form-select-sm" 
                  style="width: auto;"
                  [(ngModel)]="filters.estado"
                  (change)="loadSocios()">
                  <option value="">Todos los estados</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                  <option value="pendiente">Pendientes</option>
                </select>

                <!-- Botón Agregar -->
                <button 
                  class="btn btn-sm btn-success d-flex align-items-center"
                  (click)="openModal()">
                  <i class="fas fa-plus me-2"></i>
                  Agregar
                </button>

                <!-- Botón Exportar -->
                <div class="dropdown">
                  <button 
                    class="btn btn-sm btn-dark dropdown-toggle"
                    data-bs-toggle="dropdown">
                    <i class="fas fa-download me-1"></i>
                    Exportar
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item" href="#" (click)="exportPDF($event)">
                        <i class="fas fa-file-pdf me-2 text-danger"></i>
                        Exportar PDF
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" (click)="exportExcel($event)">
                        <i class="fas fa-file-excel me-2 text-success"></i>
                        Exportar Excel
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="card-body px-0 py-0">
            @if (isLoading()) {
              <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>
            } @else if (socios().length === 0) {
              <div class="text-center py-5">
                <i class="fas fa-users text-muted mb-3" style="font-size: 3rem;"></i>
                <p class="text-muted">No se encontraron socios</p>
              </div>
            } @else {
              <div class="table-responsive">
                <table class="table align-items-center mb-0">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center" style="width: 80px;">Estado</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7">Socio</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 d-none d-lg-table-cell">Título/Maestrías</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 d-none d-md-table-cell">Cargo</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center" style="width: 120px;">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (socio of socios(); track socio.id_socio) {
                      <tr>
                        <!-- Estado -->
                        <td class="text-center">
                          <span 
                            class="badge badge-sm"
                            [class.bg-success]="socio.estado === 'activo'"
                            [class.bg-warning]="socio.estado === 'pendiente'"
                            [class.bg-secondary]="socio.estado === 'inactivo'">
                            {{ socio.estado | titlecase }}
                          </span>
                        </td>
                        
                        <!-- Información del Socio -->
                        <td>
                          <div class="d-flex align-items-center py-1">
                            <div class="avatar avatar-sm rounded-circle me-3">
                              @if (socio.foto_url) {
                                <img [src]="socio.foto_url" [alt]="socio.nombre_completo" class="rounded-circle">
                              } @else {
                                <div class="avatar-initials bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center">
                                  {{ getInitials(socio.nombre_completo) }}
                                </div>
                              }
                            </div>
                            <div>
                              <h6 class="mb-0 text-sm font-weight-semibold">{{ socio.nombre_completo }}</h6>
                              <p class="text-xs text-muted mb-0">{{ socio.email }}</p>
                              <p class="text-xs text-muted mb-0">N° {{ socio.numero_socio }}</p>
                            </div>
                          </div>
                        </td>
                        
                        <!-- Títulos (solo desktop) -->
                        <td class="d-none d-lg-table-cell">
                          <div class="d-flex flex-wrap gap-1">
                            <span class="badge bg-secondary-subtle text-secondary">
                              Ing. Mecánico
                            </span>
                          </div>
                        </td>
                        
                        <!-- Cargo -->
                        <td class="d-none d-md-table-cell">
                          <p class="text-sm font-weight-semibold mb-0">{{ socio.cargo || '-' }}</p>
                          <p class="text-xs text-muted mb-0">{{ socio.funcion || '' }}</p>
                        </td>
                        
                        <!-- Acciones -->
                        <td class="text-center">
                          <div class="btn-group btn-group-sm">
                            <button 
                              class="btn btn-outline-secondary btn-sm"
                              title="Ver detalles"
                              (click)="viewSocio(socio)">
                              <i class="fas fa-eye"></i>
                            </button>
                            <button 
                              class="btn btn-outline-primary btn-sm"
                              title="Editar"
                              (click)="editSocio(socio)">
                              <i class="fas fa-edit"></i>
                            </button>
                            <button 
                              class="btn btn-outline-danger btn-sm"
                              title="Dar de baja"
                              (click)="confirmDelete(socio)">
                              <i class="fas fa-user-minus"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <!-- Paginación -->
              <div class="border-top py-3 px-3 d-flex align-items-center justify-content-between">
                <p class="font-weight-semibold mb-0 text-dark text-sm">
                  Mostrando {{ startRecord() }} - {{ endRecord() }} de {{ totalSocios() }}
                </p>
                <div class="d-flex gap-1">
                  <button 
                    class="btn btn-sm btn-white"
                    [disabled]="currentPage() === 1"
                    (click)="goToPage(currentPage() - 1)">
                    Anterior
                  </button>
                  
                  @for (page of visiblePages(); track page) {
                    <button 
                      class="btn btn-sm"
                      [class.btn-dark]="page === currentPage()"
                      [class.btn-white]="page !== currentPage()"
                      (click)="goToPage(page)">
                      {{ page }}
                    </button>
                  }
                  
                  <button 
                    class="btn btn-sm btn-white"
                    [disabled]="currentPage() === totalPages()"
                    (click)="goToPage(currentPage() + 1)">
                    Siguiente
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Socio -->
    <app-modal-socio 
      [isOpen]="showModal()"
      [socio]="selectedSocio()"
      [mode]="modalMode()"
      (close)="closeModal()"
      (save)="onSaveSocio($event)">
    </app-modal-socio>
  `,
  styles: [`
    .avatar {
      width: 40px;
      height: 40px;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-initials {
      width: 100%;
      height: 100%;
      font-size: 14px;
      font-weight: 600;
    }

    .bg-gradient-primary {
      background: linear-gradient(135deg, #344767 0%, #1a252f 100%);
    }

    .bg-secondary-subtle {
      background-color: rgba(108, 117, 125, 0.1);
    }
  `]
})
export class ListadoSociosComponent implements OnInit {
  private sociosService = inject(SociosService);

  socios = signal<SocioListItem[]>([]);
  isLoading = signal(true);
  searchTerm = '';
  
  filters: SocioFilters = {
    estado: '',
    page: 1,
    per_page: 10
  };

  totalSocios = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  
  showModal = signal(false);
  selectedSocio = signal<SocioListItem | null>(null);
  modalMode = signal<'create' | 'edit' | 'view'>('create');

  // Computed
  startRecord = computed(() => (this.currentPage() - 1) * (this.filters.per_page || 10) + 1);
  endRecord = computed(() => Math.min(this.currentPage() * (this.filters.per_page || 10), this.totalSocios()));
  
  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      pages.push(i);
    }
    
    return pages;
  });

  ngOnInit(): void {
    this.loadSocios();
  }

  loadSocios(): void {
    this.isLoading.set(true);
    this.filters.search = this.searchTerm;
    this.filters.page = this.currentPage();

    this.sociosService.getSocios(this.filters).subscribe({
      next: (response) => {
        this.socios.set(response.data);
        this.totalSocios.set(response.total);
        this.totalPages.set(response.last_page);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        // Cargar datos mock para desarrollo
        this.loadMockData();
      }
    });
  }

  private loadMockData(): void {
    const mockSocios: SocioListItem[] = [
      {
        id_socio: 1,
        numero_socio: 'CIMO-001',
        cedula: '0701234567',
        nombre_completo: 'Gabriel Angel Encalada Seminario',
        email: 'gabriel@cimo.com.ec',
        telefono: '0991234567',
        estado: 'activo',
        tipo_membresia: 'fundador',
        cargo: 'Presidente del CIMO',
        funcion: 'Socio Fundador',
        fecha_ingreso: new Date('2020-01-15'),
        total_pagos_realizados: 48
      },
      {
        id_socio: 2,
        numero_socio: 'CIMO-002',
        cedula: '0707654321',
        nombre_completo: 'Cristian Paúl Arias Reyes',
        email: 'cristian@cimo.com.ec',
        estado: 'activo',
        tipo_membresia: 'fundador',
        cargo: 'Vicepresidente del CIMO',
        funcion: 'Socio Fundador',
        fecha_ingreso: new Date('2020-01-15'),
        total_pagos_realizados: 48
      },
      {
        id_socio: 3,
        numero_socio: 'CIMO-003',
        cedula: '0709876543',
        nombre_completo: 'Marlon Olmedo Hernández Zhinin',
        email: 'marlon@cimo.com.ec',
        estado: 'activo',
        tipo_membresia: 'fundador',
        cargo: 'Tesorero del CIMO',
        funcion: 'Socio Fundador',
        fecha_ingreso: new Date('2020-01-15'),
        total_pagos_realizados: 45
      }
    ];

    this.socios.set(mockSocios);
    this.totalSocios.set(mockSocios.length);
    this.totalPages.set(1);
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadSocios();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadSocios();
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  openModal(): void {
    this.modalMode.set('create');
    this.selectedSocio.set(null);
    this.showModal.set(true);
  }

  viewSocio(socio: SocioListItem): void {
    this.modalMode.set('view');
    this.selectedSocio.set(socio);
    this.showModal.set(true);
  }

  editSocio(socio: SocioListItem): void {
    this.modalMode.set('edit');
    this.selectedSocio.set(socio);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedSocio.set(null);
  }

  onSaveSocio(data: any): void {
    console.log('Guardar socio:', data);
    this.closeModal();
    this.loadSocios();
  }

  confirmDelete(socio: SocioListItem): void {
    if (confirm(`¿Está seguro de dar de baja a ${socio.nombre_completo}?`)) {
      console.log('Dar de baja:', socio);
    }
  }

  exportPDF(event: Event): void {
    event.preventDefault();
    console.log('Exportar PDF');
  }

  exportExcel(event: Event): void {
    event.preventDefault();
    console.log('Exportar Excel');
  }
}
