/**
 * Mis Mensualidades Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Página principal para socios donde ven su estado de pagos
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MisMensualidades, MensualidadDetalle, getNombreMes } from '../../../core/models/pago.model';
import { PagosService } from '../services/pagos.service';

@Component({
  selector: 'app-mis-mensualidades',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="row">
      <!-- Resumen Card -->
      <div class="col-12 mb-4">
        <div class="card border shadow-xs">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="avatar avatar-lg bg-gradient-primary rounded-circle">
                  <i class="fas fa-wallet text-white"></i>
                </div>
              </div>
              <div class="col">
                <h5 class="mb-1">Mis Mensualidades</h5>
                <p class="text-sm text-muted mb-0">
                  Gestiona y revisa el estado de tus pagos mensuales
                </p>
              </div>
              <div class="col-auto">
                <a routerLink="/pagos/registrar" class="btn btn-dark btn-sm">
                  <i class="fas fa-plus me-2"></i>
                  Registrar Pago
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      @if (data()) {
        <div class="col-md-4 mb-4">
          <div class="card border shadow-xs h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="icon icon-shape bg-success-subtle rounded-circle p-3 me-3">
                  <i class="fas fa-check-circle text-success"></i>
                </div>
                <div>
                  <p class="text-sm text-muted mb-0">Total Pagado</p>
                  <h4 class="mb-0">$ {{ data()!.resumen.total_pagado.toFixed(2) }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card border shadow-xs h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="icon icon-shape bg-warning-subtle rounded-circle p-3 me-3">
                  <i class="fas fa-clock text-warning"></i>
                </div>
                <div>
                  <p class="text-sm text-muted mb-0">Pagos Pendientes</p>
                  <h4 class="mb-0">{{ data()!.resumen.pagos_pendientes }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card border shadow-xs h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="icon icon-shape bg-info-subtle rounded-circle p-3 me-3">
                  <i class="fas fa-calendar text-info"></i>
                </div>
                <div>
                  <p class="text-sm text-muted mb-0">Cuota Mensual</p>
                  <h4 class="mb-0">$ {{ data()!.socio.cuota_mensual.toFixed(2) }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Tabla de Mensualidades -->
      <div class="col-12">
        <div class="card border shadow-xs">
          <div class="card-header border-bottom pb-0">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 class="font-weight-semibold text-lg mb-0">Historial de Mensualidades</h6>
                <p class="text-sm text-muted mb-0">Año {{ currentYear }}</p>
              </div>
              <div class="btn-group btn-group-sm">
                <button 
                  class="btn btn-outline-secondary"
                  [class.active]="selectedYear() === currentYear - 1"
                  (click)="changeYear(currentYear - 1)">
                  {{ currentYear - 1 }}
                </button>
                <button 
                  class="btn btn-outline-secondary"
                  [class.active]="selectedYear() === currentYear"
                  (click)="changeYear(currentYear)">
                  {{ currentYear }}
                </button>
              </div>
            </div>
          </div>

          <div class="card-body px-0 py-0">
            @if (isLoading()) {
              <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2 text-muted">Cargando mensualidades...</p>
              </div>
            } @else if (data() && data()!.mensualidades.length > 0) {
              <div class="table-responsive">
                <table class="table align-items-center mb-0">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-4">Mes</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-2">Monto</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-2">Fecha de Pago</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-2">Estado</th>
                      <th class="text-center text-secondary text-xs font-weight-semibold opacity-7">Comprobante</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (mes of data()!.mensualidades; track mes.mes) {
                      <tr>
                        <td class="ps-4">
                          <p class="text-sm font-weight-semibold mb-0">{{ mes.mes_nombre }}</p>
                          <p class="text-xs text-muted mb-0">{{ mes.anio }}</p>
                        </td>
                        <td>
                          <p class="text-sm mb-0">
                            @if (mes.monto_pagado) {
                              $ {{ mes.monto_pagado.toFixed(2) }}
                            } @else {
                              $ {{ mes.monto_esperado.toFixed(2) }}
                            }
                          </p>
                        </td>
                        <td>
                          <p class="text-sm mb-0">
                            @if (mes.fecha_pago) {
                              {{ mes.fecha_pago | date:'dd/MM/yyyy' }}
                            } @else {
                              <span class="text-muted">-</span>
                            }
                          </p>
                        </td>
                        <td>
                          <span 
                            class="badge"
                            [class.bg-success]="mes.estado === 'pagado'"
                            [class.bg-warning]="mes.estado === 'pendiente'"
                            [class.bg-danger]="mes.estado === 'vencido'"
                            [class.bg-info]="mes.estado === 'en_revision'">
                            {{ getEstadoLabel(mes.estado) }}
                          </span>
                        </td>
                        <td class="text-center">
                          @if (mes.comprobante_url) {
                            <a 
                              [href]="mes.comprobante_url" 
                              target="_blank"
                              class="btn btn-link btn-sm text-primary p-0">
                              <i class="fas fa-file-image me-1"></i>
                              Ver
                            </a>
                          } @else if (mes.estado === 'pendiente' || mes.estado === 'vencido') {
                            <a 
                              routerLink="/pagos/registrar"
                              [queryParams]="{ mes: mes.mes, anio: mes.anio }"
                              class="btn btn-sm btn-outline-primary">
                              <i class="fas fa-upload me-1"></i>
                              Subir
                            </a>
                          } @else {
                            <span class="text-muted">-</span>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <div class="text-center py-5">
                <i class="fas fa-folder-open text-muted mb-3" style="font-size: 3rem;"></i>
                <p class="text-muted">No hay mensualidades registradas para este año</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-lg {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .bg-gradient-primary {
      background: linear-gradient(135deg, #344767 0%, #1a252f 100%);
    }

    .bg-success-subtle {
      background-color: rgba(25, 135, 84, 0.1);
    }

    .bg-warning-subtle {
      background-color: rgba(255, 193, 7, 0.1);
    }

    .bg-info-subtle {
      background-color: rgba(13, 202, 240, 0.1);
    }

    .icon-shape {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-group .btn.active {
      background-color: #344767;
      border-color: #344767;
      color: white;
    }
  `]
})
export class MisMensualidadesComponent implements OnInit {
  private pagosService = inject(PagosService);

  data = signal<MisMensualidades | null>(null);
  isLoading = signal(true);
  selectedYear = signal(new Date().getFullYear());
  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.loadMensualidades();
  }

  changeYear(year: number): void {
    this.selectedYear.set(year);
    this.loadMensualidades();
  }

  private loadMensualidades(): void {
    this.isLoading.set(true);
    
    this.pagosService.getMisMensualidades(this.selectedYear()).subscribe({
      next: (data) => {
        this.data.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        // Datos de ejemplo para desarrollo
        this.data.set(this.getMockData());
      }
    });
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      'pagado': 'Pagado',
      'pendiente': 'Pendiente',
      'vencido': 'Vencido',
      'en_revision': 'En Revisión'
    };
    return labels[estado] || estado;
  }

  // Datos mock para desarrollo
  private getMockData(): MisMensualidades {
    const currentMonth = new Date().getMonth() + 1;
    const mensualidades: MensualidadDetalle[] = [];

    for (let i = 1; i <= 12; i++) {
      let estado: 'pagado' | 'pendiente' | 'vencido' | 'en_revision' = 'pendiente';
      let fechaPago: Date | undefined;
      let montoPagado: number | undefined;

      if (i < currentMonth - 1) {
        estado = 'pagado';
        fechaPago = new Date(this.selectedYear(), i - 1, 15);
        montoPagado = 25;
      } else if (i === currentMonth - 1) {
        estado = 'en_revision';
        fechaPago = new Date(this.selectedYear(), i - 1, 20);
        montoPagado = 25;
      } else if (i === currentMonth) {
        estado = 'pendiente';
      } else if (i > currentMonth) {
        continue; // No mostrar meses futuros
      }

      mensualidades.push({
        mes: i,
        anio: this.selectedYear(),
        mes_nombre: getNombreMes(i),
        monto_esperado: 25,
        monto_pagado: montoPagado,
        fecha_pago: fechaPago,
        estado,
        comprobante_url: estado === 'pagado' ? '#' : undefined
      });
    }

    return {
      socio: {
        id_socio: 1,
        numero_socio: 'CIMO-001',
        nombre_completo: 'Usuario Demo',
        cuota_mensual: 25
      },
      resumen: {
        total_pagado: (currentMonth - 2) * 25,
        pagos_pendientes: 1,
        ultimo_pago: new Date(),
        proximo_vencimiento: new Date()
      },
      mensualidades
    };
  }
}
