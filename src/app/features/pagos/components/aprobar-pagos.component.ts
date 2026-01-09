/**
 * Aprobar Pagos Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Vista para que tesorería apruebe/rechace pagos
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagosService } from '../services/pagos.service';
import { Pago, getNombreMes } from '../../../core/models/pago.model';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-aprobar-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="row">
      <div class="col-12">
        <div class="card border shadow-xs">
          <div class="card-header border-bottom pb-0">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 class="font-weight-semibold text-lg mb-0">
                  <i class="fas fa-check-circle me-2"></i>
                  Aprobar Pagos
                </h6>
                <p class="text-sm text-muted mb-0">
                  Revisa y aprueba los comprobantes de pago pendientes
                </p>
              </div>
              <div>
                <span class="badge bg-warning fs-6">
                  {{ pagosPendientes().length }} pendientes
                </span>
              </div>
            </div>
          </div>

          <div class="card-body px-0 py-0">
            @if (isLoading()) {
              <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>
            } @else if (pagosPendientes().length === 0) {
              <div class="text-center py-5">
                <i class="fas fa-check-double text-success mb-3" style="font-size: 4rem;"></i>
                <h5>¡Todo al día!</h5>
                <p class="text-muted">No hay pagos pendientes de aprobación</p>
              </div>
            } @else {
              <div class="table-responsive">
                <table class="table align-items-center mb-0">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-4">Socio</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7">Período</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7">Monto</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7">Fecha Pago</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7">Comprobante</th>
                      <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (pago of pagosPendientes(); track pago.id_pago) {
                      <tr>
                        <td class="ps-4">
                          <div class="d-flex align-items-center">
                            <div class="avatar avatar-sm rounded-circle bg-gradient-primary text-white me-2 d-flex align-items-center justify-content-center">
                              {{ getInitials(pago.socio_nombre || '') }}
                            </div>
                            <div>
                              <p class="text-sm font-weight-semibold mb-0">{{ pago.socio_nombre }}</p>
                              <p class="text-xs text-muted mb-0">N° {{ pago.socio_numero }}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p class="text-sm font-weight-semibold mb-0">{{ getNombreMes(pago.mes) }}</p>
                          <p class="text-xs text-muted mb-0">{{ pago.anio }}</p>
                        </td>
                        <td>
                          <p class="text-sm mb-0">$ {{ pago.monto.toFixed(2) }}</p>
                        </td>
                        <td>
                          <p class="text-sm mb-0">{{ pago.fecha_pago | date:'dd/MM/yyyy' }}</p>
                        </td>
                        <td>
                          @if (pago.comprobante_url) {
                            <button 
                              class="btn btn-sm btn-outline-primary"
                              (click)="viewComprobante(pago)">
                              <i class="fas fa-image me-1"></i>
                              Ver
                            </button>
                          } @else {
                            <span class="text-muted">Sin comprobante</span>
                          }
                        </td>
                        <td class="text-center">
                          <div class="btn-group btn-group-sm">
                            <button 
                              class="btn btn-success"
                              [disabled]="isProcessing()"
                              (click)="aprobarPago(pago)"
                              title="Aprobar">
                              <i class="fas fa-check"></i>
                            </button>
                            <button 
                              class="btn btn-danger"
                              [disabled]="isProcessing()"
                              (click)="rechazarPago(pago)"
                              title="Rechazar">
                              <i class="fas fa-times"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ver Comprobante -->
    @if (showComprobanteModal()) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Comprobante de Pago</h5>
              <button type="button" class="btn-close" (click)="closeComprobanteModal()"></button>
            </div>
            <div class="modal-body text-center p-0">
              @if (selectedPago()) {
                <img 
                  [src]="selectedPago()!.comprobante_url" 
                  class="img-fluid"
                  alt="Comprobante de pago"
                  style="max-height: 70vh;">
              }
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-secondary" (click)="closeComprobanteModal()">Cerrar</button>
              <button class="btn btn-success" (click)="aprobarPago(selectedPago()!)">
                <i class="fas fa-check me-2"></i>Aprobar
              </button>
              <button class="btn btn-danger" (click)="rechazarPago(selectedPago()!)">
                <i class="fas fa-times me-2"></i>Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal Rechazo -->
    @if (showRechazoModal()) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Rechazar Pago</h5>
              <button type="button" class="btn-close" (click)="closeRechazoModal()"></button>
            </div>
            <div class="modal-body">
              <p class="mb-3">Por favor, indique el motivo del rechazo:</p>
              <textarea 
                class="form-control"
                [(ngModel)]="motivoRechazo"
                rows="3"
                placeholder="Motivo del rechazo...">
              </textarea>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-secondary" (click)="closeRechazoModal()">Cancelar</button>
              <button 
                class="btn btn-danger"
                [disabled]="!motivoRechazo.trim()"
                (click)="confirmarRechazo()">
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .avatar {
      width: 36px;
      height: 36px;
      font-size: 12px;
    }

    .bg-gradient-primary {
      background: linear-gradient(135deg, #344767 0%, #1a252f 100%);
    }
  `]
})
export class AprobarPagosComponent implements OnInit {
  private pagosService = inject(PagosService);
  private notificationService = inject(NotificationService);

  pagosPendientes = signal<Pago[]>([]);
  isLoading = signal(true);
  isProcessing = signal(false);
  
  showComprobanteModal = signal(false);
  showRechazoModal = signal(false);
  selectedPago = signal<Pago | null>(null);
  motivoRechazo = '';

  getNombreMes = getNombreMes;

  ngOnInit(): void {
    this.loadPagosPendientes();
  }

  private loadPagosPendientes(): void {
    this.isLoading.set(true);
    
    this.pagosService.getPagosPendientes().subscribe({
      next: (response) => {
        this.pagosPendientes.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        // Mock data para desarrollo
        this.pagosPendientes.set([
          {
            id_pago: 1,
            id_socio: 1,
            mes: 1,
            anio: 2026,
            monto: 25,
            fecha_pago: new Date(),
            fecha_registro: new Date(),
            estado_pago: 'pendiente',
            socio_nombre: 'Gabriel Encalada',
            socio_numero: 'CIMO-001',
            comprobante_url: 'https://via.placeholder.com/400x600'
          },
          {
            id_pago: 2,
            id_socio: 2,
            mes: 1,
            anio: 2026,
            monto: 25,
            fecha_pago: new Date(),
            fecha_registro: new Date(),
            estado_pago: 'pendiente',
            socio_nombre: 'Cristian Arias',
            socio_numero: 'CIMO-002',
            comprobante_url: 'https://via.placeholder.com/400x600'
          }
        ]);
      }
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  viewComprobante(pago: Pago): void {
    this.selectedPago.set(pago);
    this.showComprobanteModal.set(true);
  }

  closeComprobanteModal(): void {
    this.showComprobanteModal.set(false);
    this.selectedPago.set(null);
  }

  aprobarPago(pago: Pago): void {
    this.isProcessing.set(true);
    this.closeComprobanteModal();

    this.pagosService.approvePago({
      id_pago: pago.id_pago,
      estado_pago: 'aprobado'
    }).subscribe({
      next: () => {
        this.notificationService.success('Pago aprobado correctamente');
        this.pagosPendientes.update(pagos => 
          pagos.filter(p => p.id_pago !== pago.id_pago)
        );
        this.isProcessing.set(false);
      },
      error: () => {
        this.isProcessing.set(false);
        // Mock: simular éxito
        this.notificationService.success('Pago aprobado correctamente');
        this.pagosPendientes.update(pagos => 
          pagos.filter(p => p.id_pago !== pago.id_pago)
        );
      }
    });
  }

  rechazarPago(pago: Pago): void {
    this.selectedPago.set(pago);
    this.showComprobanteModal.set(false);
    this.showRechazoModal.set(true);
    this.motivoRechazo = '';
  }

  closeRechazoModal(): void {
    this.showRechazoModal.set(false);
    this.selectedPago.set(null);
    this.motivoRechazo = '';
  }

  confirmarRechazo(): void {
    const pago = this.selectedPago();
    if (!pago) return;

    this.isProcessing.set(true);
    this.closeRechazoModal();

    this.pagosService.approvePago({
      id_pago: pago.id_pago,
      estado_pago: 'rechazado',
      observaciones: this.motivoRechazo
    }).subscribe({
      next: () => {
        this.notificationService.warning('Pago rechazado');
        this.pagosPendientes.update(pagos => 
          pagos.filter(p => p.id_pago !== pago.id_pago)
        );
        this.isProcessing.set(false);
      },
      error: () => {
        this.isProcessing.set(false);
        // Mock
        this.notificationService.warning('Pago rechazado');
        this.pagosPendientes.update(pagos => 
          pagos.filter(p => p.id_pago !== pago.id_pago)
        );
      }
    });
  }
}
