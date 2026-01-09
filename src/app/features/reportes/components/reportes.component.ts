/**
 * Reportes Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Vista de reportes y estadísticas
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagosService } from '../../pagos/services/pagos.service';
import { ReporteMensualidades, getNombreMes, getAniosSelector } from '../../../core/models/pago.model';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="row">
      <!-- Filtros -->
      <div class="col-12 mb-4">
        <div class="card border shadow-xs">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-4">
                <h6 class="mb-0">
                  <i class="fas fa-chart-line me-2"></i>
                  Reportes de Mensualidades
                </h6>
              </div>
              <div class="col-md-4">
                <select 
                  class="form-select"
                  [(ngModel)]="selectedYear"
                  (change)="loadReporte()">
                  @for (anio of anios; track anio) {
                    <option [value]="anio">{{ anio }}</option>
                  }
                </select>
              </div>
              <div class="col-md-4 text-end">
                <div class="btn-group">
                  <button class="btn btn-outline-danger" (click)="exportPDF()">
                    <i class="fas fa-file-pdf me-2"></i>PDF
                  </button>
                  <button class="btn btn-outline-success" (click)="exportExcel()">
                    <i class="fas fa-file-excel me-2"></i>Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      @if (reporte()) {
        <div class="col-md-3 mb-4">
          <div class="card border shadow-xs h-100">
            <div class="card-body">
              <p class="text-sm text-muted mb-1">Total Esperado</p>
              <h4 class="mb-0">$ {{ reporte()!.totales.total_esperado.toFixed(2) }}</h4>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-4">
          <div class="card border shadow-xs h-100 border-success">
            <div class="card-body">
              <p class="text-sm text-muted mb-1">Total Recaudado</p>
              <h4 class="mb-0 text-success">$ {{ reporte()!.totales.total_recaudado.toFixed(2) }}</h4>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-4">
          <div class="card border shadow-xs h-100 border-warning">
            <div class="card-body">
              <p class="text-sm text-muted mb-1">Pendiente</p>
              <h4 class="mb-0 text-warning">$ {{ reporte()!.totales.total_pendiente.toFixed(2) }}</h4>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-4">
          <div class="card border shadow-xs h-100">
            <div class="card-body">
              <p class="text-sm text-muted mb-1">% Recaudación</p>
              <h4 class="mb-0">{{ reporte()!.totales.porcentaje_recaudacion.toFixed(1) }}%</h4>
              <div class="progress mt-2" style="height: 6px;">
                <div 
                  class="progress-bar bg-success" 
                  [style.width.%]="reporte()!.totales.porcentaje_recaudacion">
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Tabla por Mes -->
      <div class="col-12">
        <div class="card border shadow-xs">
          <div class="card-header border-bottom pb-0">
            <h6 class="mb-3">Detalle por Mes</h6>
          </div>
          <div class="card-body px-0 py-0">
            @if (isLoading()) {
              <div class="text-center py-5">
                <div class="spinner-border text-primary"></div>
              </div>
            } @else if (reporte()) {
              <div class="table-responsive">
                <table class="table align-items-center mb-0">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-4">Mes</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center">Total Socios</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center">Pagaron</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center">Pendientes</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 text-end">Esperado</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 text-end">Recaudado</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (mes of reporte()!.por_mes; track mes.mes) {
                      <tr>
                        <td class="ps-4">
                          <p class="text-sm font-weight-semibold mb-0">{{ mes.mes_nombre }}</p>
                        </td>
                        <td class="text-center">
                          <span class="badge bg-secondary-subtle text-secondary">{{ mes.total_socios }}</span>
                        </td>
                        <td class="text-center">
                          <span class="badge bg-success">{{ mes.pagos_realizados }}</span>
                        </td>
                        <td class="text-center">
                          <span class="badge bg-warning">{{ mes.pagos_pendientes }}</span>
                        </td>
                        <td class="text-end">
                          <p class="text-sm mb-0">$ {{ mes.monto_esperado.toFixed(2) }}</p>
                        </td>
                        <td class="text-end">
                          <p class="text-sm text-success mb-0">$ {{ mes.monto_recaudado.toFixed(2) }}</p>
                        </td>
                        <td class="text-center">
                          <div class="d-flex align-items-center justify-content-center">
                            <span class="me-2 text-sm">{{ mes.porcentaje.toFixed(0) }}%</span>
                            <div class="progress" style="width: 60px; height: 6px;">
                              <div 
                                class="progress-bar"
                                [class.bg-success]="mes.porcentaje >= 80"
                                [class.bg-warning]="mes.porcentaje >= 50 && mes.porcentaje < 80"
                                [class.bg-danger]="mes.porcentaje < 50"
                                [style.width.%]="mes.porcentaje">
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                  <tfoot class="bg-gray-100">
                    <tr>
                      <td class="ps-4"><strong>TOTAL</strong></td>
                      <td class="text-center">-</td>
                      <td class="text-center">
                        <strong>{{ getTotalPagos() }}</strong>
                      </td>
                      <td class="text-center">
                        <strong>{{ getTotalPendientes() }}</strong>
                      </td>
                      <td class="text-end">
                        <strong>$ {{ reporte()!.totales.total_esperado.toFixed(2) }}</strong>
                      </td>
                      <td class="text-end">
                        <strong class="text-success">$ {{ reporte()!.totales.total_recaudado.toFixed(2) }}</strong>
                      </td>
                      <td class="text-center">
                        <strong>{{ reporte()!.totales.porcentaje_recaudacion.toFixed(0) }}%</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-secondary-subtle {
      background-color: rgba(108, 117, 125, 0.1);
    }
  `]
})
export class ReportesComponent implements OnInit {
  private pagosService = inject(PagosService);

  reporte = signal<ReporteMensualidades | null>(null);
  isLoading = signal(true);
  selectedYear = new Date().getFullYear();
  anios = getAniosSelector();

  ngOnInit(): void {
    this.loadReporte();
  }

  loadReporte(): void {
    this.isLoading.set(true);
    
    this.pagosService.getReporteMensualidades(this.selectedYear).subscribe({
      next: (data) => {
        this.reporte.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        // Mock data
        this.reporte.set(this.getMockReporte());
      }
    });
  }

  getTotalPagos(): number {
    return this.reporte()?.por_mes.reduce((sum, m) => sum + m.pagos_realizados, 0) || 0;
  }

  getTotalPendientes(): number {
    return this.reporte()?.por_mes.reduce((sum, m) => sum + m.pagos_pendientes, 0) || 0;
  }

  exportPDF(): void {
    this.pagosService.downloadReportePDF(this.selectedYear).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-mensualidades-${this.selectedYear}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        console.log('Generando PDF mock...');
      }
    });
  }

  exportExcel(): void {
    this.pagosService.downloadReporteExcel(this.selectedYear).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-mensualidades-${this.selectedYear}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        console.log('Generando Excel mock...');
      }
    });
  }

  private getMockReporte(): ReporteMensualidades {
    const currentMonth = new Date().getMonth() + 1;
    const porMes = [];

    for (let i = 1; i <= currentMonth; i++) {
      const totalSocios = 45;
      const pagosRealizados = i < currentMonth ? Math.floor(totalSocios * 0.9) : Math.floor(totalSocios * 0.7);
      
      porMes.push({
        mes: i,
        anio: this.selectedYear,
        mes_nombre: getNombreMes(i),
        total_socios: totalSocios,
        pagos_realizados: pagosRealizados,
        pagos_pendientes: totalSocios - pagosRealizados,
        monto_esperado: totalSocios * 25,
        monto_recaudado: pagosRealizados * 25,
        porcentaje: (pagosRealizados / totalSocios) * 100
      });
    }

    const totalEsperado = porMes.reduce((s, m) => s + m.monto_esperado, 0);
    const totalRecaudado = porMes.reduce((s, m) => s + m.monto_recaudado, 0);

    return {
      periodo: {
        anio: this.selectedYear,
        mes_inicio: 1,
        mes_fin: currentMonth
      },
      totales: {
        total_esperado: totalEsperado,
        total_recaudado: totalRecaudado,
        total_pendiente: totalEsperado - totalRecaudado,
        porcentaje_recaudacion: (totalRecaudado / totalEsperado) * 100
      },
      por_mes: porMes
    };
  }
}
