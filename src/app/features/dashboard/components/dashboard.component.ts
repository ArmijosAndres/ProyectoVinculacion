/**
 * Dashboard Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Panel principal para la directiva con estadísticas
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface DashboardStats {
  totalSocios: number;
  sociosActivos: number;
  recaudacionMes: number;
  pagosPendientes: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="row">
      <!-- Bienvenida -->
      <div class="col-12 mb-4">
        <div class="card bg-gradient-dark text-white">
          <div class="card-body p-4">
            <div class="row align-items-center">
              <div class="col">
                <h4 class="mb-1">Bienvenido al Panel de Gestión</h4>
                <p class="mb-0 opacity-75">
                  Colegio de Ingenieros Mecánicos de El Oro
                </p>
              </div>
              <div class="col-auto">
                <img src="assets/img/logocimo.ico" alt="CIMO" style="height: 60px; opacity: 0.8;">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="col-xl-3 col-sm-6 mb-4">
        <div class="card border shadow-xs h-100">
          <div class="card-body">
            <div class="row">
              <div class="col-8">
                <p class="text-sm mb-1 text-muted">Total Socios</p>
                <h5 class="font-weight-bold mb-0">{{ stats().totalSocios }}</h5>
                <span class="text-success text-xs">
                  <i class="fas fa-arrow-up me-1"></i>
                  +2 este mes
                </span>
              </div>
              <div class="col-4 text-end">
                <div class="icon-shape bg-primary-subtle rounded-circle p-3">
                  <i class="fas fa-users text-primary" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-sm-6 mb-4">
        <div class="card border shadow-xs h-100">
          <div class="card-body">
            <div class="row">
              <div class="col-8">
                <p class="text-sm mb-1 text-muted">Socios Activos</p>
                <h5 class="font-weight-bold mb-0">{{ stats().sociosActivos }}</h5>
                <span class="text-success text-xs">
                  {{ getActivosPercent() }}% del total
                </span>
              </div>
              <div class="col-4 text-end">
                <div class="icon-shape bg-success-subtle rounded-circle p-3">
                  <i class="fas fa-user-check text-success" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-sm-6 mb-4">
        <div class="card border shadow-xs h-100">
          <div class="card-body">
            <div class="row">
              <div class="col-8">
                <p class="text-sm mb-1 text-muted">Recaudación del Mes</p>
                <h5 class="font-weight-bold mb-0">$ {{ stats().recaudacionMes.toFixed(2) }}</h5>
                <span class="text-muted text-xs">
                  {{ getMesActual() }}
                </span>
              </div>
              <div class="col-4 text-end">
                <div class="icon-shape bg-info-subtle rounded-circle p-3">
                  <i class="fas fa-dollar-sign text-info" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-sm-6 mb-4">
        <div class="card border shadow-xs h-100">
          <div class="card-body">
            <div class="row">
              <div class="col-8">
                <p class="text-sm mb-1 text-muted">Pagos Pendientes</p>
                <h5 class="font-weight-bold mb-0">{{ stats().pagosPendientes }}</h5>
                <span class="text-warning text-xs">
                  <i class="fas fa-clock me-1"></i>
                  Por aprobar
                </span>
              </div>
              <div class="col-4 text-end">
                <div class="icon-shape bg-warning-subtle rounded-circle p-3">
                  <i class="fas fa-hourglass-half text-warning" style="font-size: 1.5rem;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="col-lg-4 mb-4">
        <div class="card border shadow-xs h-100">
          <div class="card-header pb-0">
            <h6 class="mb-0">Acciones Rápidas</h6>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <a routerLink="/socios" class="btn btn-outline-primary text-start">
                <i class="fas fa-users me-2"></i>
                Ver Socios
              </a>
              <a routerLink="/pagos/aprobar" class="btn btn-outline-warning text-start">
                <i class="fas fa-check-circle me-2"></i>
                Aprobar Pagos
                @if (stats().pagosPendientes > 0) {
                  <span class="badge bg-warning text-dark ms-2">{{ stats().pagosPendientes }}</span>
                }
              </a>
              <a routerLink="/reportes" class="btn btn-outline-info text-start">
                <i class="fas fa-chart-line me-2"></i>
                Ver Reportes
              </a>
              <a routerLink="/solicitudes" class="btn btn-outline-secondary text-start">
                <i class="fas fa-user-plus me-2"></i>
                Solicitudes de Registro
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagos Recientes -->
      <div class="col-lg-8 mb-4">
        <div class="card border shadow-xs h-100">
          <div class="card-header d-flex justify-content-between align-items-center pb-0">
            <h6 class="mb-0">Pagos Recientes</h6>
            <a routerLink="/pagos/aprobar" class="text-sm text-primary">Ver todos</a>
          </div>
          <div class="card-body px-0 pb-0">
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-4">Socio</th>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7">Monto</th>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7">Período</th>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (pago of pagosRecientes(); track pago.id) {
                    <tr>
                      <td class="ps-4">
                        <div class="d-flex align-items-center">
                          <div class="avatar avatar-sm rounded-circle bg-gradient-primary text-white me-2 d-flex align-items-center justify-content-center">
                            {{ pago.initials }}
                          </div>
                          <div>
                            <p class="text-sm font-weight-semibold mb-0">{{ pago.socio }}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p class="text-sm mb-0">$ {{ pago.monto.toFixed(2) }}</p>
                      </td>
                      <td>
                        <p class="text-sm mb-0">{{ pago.periodo }}</p>
                      </td>
                      <td class="text-center">
                        <span 
                          class="badge"
                          [class.bg-success]="pago.estado === 'aprobado'"
                          [class.bg-warning]="pago.estado === 'pendiente'">
                          {{ pago.estado | titlecase }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-gradient-dark {
      background: linear-gradient(135deg, #1a252f 0%, #344767 100%);
    }

    .icon-shape {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .bg-primary-subtle { background-color: rgba(52, 71, 103, 0.1); }
    .bg-success-subtle { background-color: rgba(25, 135, 84, 0.1); }
    .bg-info-subtle { background-color: rgba(13, 202, 240, 0.1); }
    .bg-warning-subtle { background-color: rgba(255, 193, 7, 0.1); }

    .avatar {
      width: 32px;
      height: 32px;
      font-size: 12px;
    }

    .bg-gradient-primary {
      background: linear-gradient(135deg, #344767 0%, #1a252f 100%);
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStats>({
    totalSocios: 0,
    sociosActivos: 0,
    recaudacionMes: 0,
    pagosPendientes: 0
  });

  pagosRecientes = signal<any[]>([]);

  ngOnInit(): void {
    this.loadStats();
    this.loadPagosRecientes();
  }

  private loadStats(): void {
    // TODO: Cargar desde API
    this.stats.set({
      totalSocios: 45,
      sociosActivos: 42,
      recaudacionMes: 1050.00,
      pagosPendientes: 3
    });
  }

  private loadPagosRecientes(): void {
    // TODO: Cargar desde API
    this.pagosRecientes.set([
      { id: 1, socio: 'Gabriel Encalada', initials: 'GE', monto: 25, periodo: 'Enero 2026', estado: 'aprobado' },
      { id: 2, socio: 'Cristian Arias', initials: 'CA', monto: 25, periodo: 'Enero 2026', estado: 'pendiente' },
      { id: 3, socio: 'Marlon Hernández', initials: 'MH', monto: 25, periodo: 'Enero 2026', estado: 'pendiente' },
      { id: 4, socio: 'Ronald Mayancela', initials: 'RM', monto: 25, periodo: 'Diciembre 2025', estado: 'aprobado' }
    ]);
  }

  getActivosPercent(): number {
    const s = this.stats();
    return s.totalSocios > 0 ? Math.round((s.sociosActivos / s.totalSocios) * 100) : 0;
  }

  getMesActual(): string {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const date = new Date();
    return `${meses[date.getMonth()]} ${date.getFullYear()}`;
  }
}
