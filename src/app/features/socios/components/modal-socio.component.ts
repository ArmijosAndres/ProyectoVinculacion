/**
 * Modal Socio Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Modal reutilizable para crear, editar y ver socios
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SocioListItem } from '../../../core/models/socio.model';

@Component({
  selector: 'app-modal-socio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (isOpen) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <!-- Header -->
            <div class="modal-header">
              <h5 class="modal-title">
                <i [class]="getTitleIcon()" class="me-2"></i>
                {{ getTitle() }}
              </h5>
              <button type="button" class="btn-close" (click)="onClose()"></button>
            </div>

            <!-- Body -->
            <div class="modal-body">
              @if (mode === 'view' && socio) {
                <!-- Vista de solo lectura -->
                <div class="row">
                  <div class="col-md-4 text-center mb-4">
                    <div class="avatar-xl mx-auto mb-3">
                      @if (socio.foto_url) {
                        <img [src]="socio.foto_url" class="rounded-circle w-100 h-100" style="object-fit: cover;">
                      } @else {
                        <div class="avatar-initials bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center w-100 h-100">
                          {{ getInitials(socio.nombre_completo) }}
                        </div>
                      }
                    </div>
                    <h5 class="mb-1">{{ socio.nombre_completo }}</h5>
                    <p class="text-muted mb-2">{{ socio.cargo || 'Socio' }}</p>
                    <span 
                      class="badge"
                      [class.bg-success]="socio.estado === 'activo'"
                      [class.bg-warning]="socio.estado === 'pendiente'"
                      [class.bg-secondary]="socio.estado === 'inactivo'">
                      {{ socio.estado | titlecase }}
                    </span>
                  </div>
                  <div class="col-md-8">
                    <div class="row g-3">
                      <div class="col-6">
                        <label class="text-muted small">Número de Socio</label>
                        <p class="mb-0 fw-semibold">{{ socio.numero_socio }}</p>
                      </div>
                      <div class="col-6">
                        <label class="text-muted small">Cédula</label>
                        <p class="mb-0">{{ socio.cedula }}</p>
                      </div>
                      <div class="col-6">
                        <label class="text-muted small">Email</label>
                        <p class="mb-0">{{ socio.email }}</p>
                      </div>
                      <div class="col-6">
                        <label class="text-muted small">Teléfono</label>
                        <p class="mb-0">{{ socio.telefono || '-' }}</p>
                      </div>
                      <div class="col-6">
                        <label class="text-muted small">Tipo de Membresía</label>
                        <p class="mb-0">{{ socio.tipo_membresia | titlecase }}</p>
                      </div>
                      <div class="col-6">
                        <label class="text-muted small">Fecha de Ingreso</label>
                        <p class="mb-0">{{ socio.fecha_ingreso | date:'dd/MM/yyyy' }}</p>
                      </div>
                      <div class="col-12">
                        <label class="text-muted small">Función</label>
                        <p class="mb-0">{{ socio.funcion || '-' }}</p>
                      </div>
                      <div class="col-12">
                        <label class="text-muted small">Total Pagos Realizados</label>
                        <p class="mb-0">{{ socio.total_pagos_realizados }} mensualidades</p>
                      </div>
                    </div>
                  </div>
                </div>
              } @else {
                <!-- Formulario de edición/creación -->
                <form [formGroup]="socioForm">
                  <div class="row g-3">
                    <!-- Datos Personales -->
                    <div class="col-12">
                      <h6 class="text-primary mb-3">
                        <i class="fas fa-user me-2"></i>
                        Datos Personales
                      </h6>
                    </div>

                    <div class="col-md-4">
                      <label class="form-label">Cédula *</label>
                      <input 
                        type="text" 
                        class="form-control"
                        formControlName="cedula"
                        maxlength="10"
                        placeholder="0701234567"
                        [readonly]="mode === 'edit'"
                        [class.is-invalid]="isFieldInvalid('cedula')">
                      @if (isFieldInvalid('cedula')) {
                        <div class="invalid-feedback">Cédula requerida (10 dígitos)</div>
                      }
                    </div>

                    <div class="col-md-4">
                      <label class="form-label">Nombres *</label>
                      <input 
                        type="text" 
                        class="form-control"
                        formControlName="nombres"
                        placeholder="Nombres completos"
                        [class.is-invalid]="isFieldInvalid('nombres')">
                      @if (isFieldInvalid('nombres')) {
                        <div class="invalid-feedback">Los nombres son requeridos</div>
                      }
                    </div>

                    <div class="col-md-4">
                      <label class="form-label">Apellidos *</label>
                      <input 
                        type="text" 
                        class="form-control"
                        formControlName="apellidos"
                        placeholder="Apellidos completos"
                        [class.is-invalid]="isFieldInvalid('apellidos')">
                      @if (isFieldInvalid('apellidos')) {
                        <div class="invalid-feedback">Los apellidos son requeridos</div>
                      }
                    </div>

                    <div class="col-md-6">
                      <label class="form-label">Email *</label>
                      <input 
                        type="email" 
                        class="form-control"
                        formControlName="email"
                        placeholder="correo@ejemplo.com"
                        [class.is-invalid]="isFieldInvalid('email')">
                      @if (isFieldInvalid('email')) {
                        <div class="invalid-feedback">Email válido requerido</div>
                      }
                    </div>

                    <div class="col-md-6">
                      <label class="form-label">Teléfono</label>
                      <input 
                        type="tel" 
                        class="form-control"
                        formControlName="telefono"
                        placeholder="0991234567"
                        maxlength="10">
                    </div>

                    <div class="col-12">
                      <label class="form-label">Dirección</label>
                      <textarea 
                        class="form-control"
                        formControlName="direccion"
                        rows="2"
                        placeholder="Dirección completa">
                      </textarea>
                    </div>

                    <!-- Información Profesional -->
                    <div class="col-12 mt-4">
                      <h6 class="text-primary mb-3">
                        <i class="fas fa-graduation-cap me-2"></i>
                        Información Profesional
                      </h6>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label">Título Profesional</label>
                      <input 
                        type="text" 
                        class="form-control"
                        formControlName="titulo"
                        placeholder="Ej: Ingeniero Mecánico">
                    </div>

                    <div class="col-md-6">
                      <label class="form-label">Universidad</label>
                      <input 
                        type="text" 
                        class="form-control"
                        formControlName="universidad"
                        placeholder="Universidad de origen">
                    </div>

                    <!-- Información de Membresía -->
                    <div class="col-12 mt-4">
                      <h6 class="text-primary mb-3">
                        <i class="fas fa-id-card me-2"></i>
                        Información de Membresía
                      </h6>
                    </div>

                    <div class="col-md-4">
                      <label class="form-label">Tipo de Membresía</label>
                      <select class="form-select" formControlName="tipo_membresia">
                        <option value="regular">Regular</option>
                        <option value="fundador">Fundador</option>
                        <option value="honorario">Honorario</option>
                        <option value="vitalicio">Vitalicio</option>
                      </select>
                    </div>

                    <div class="col-md-4">
                      <label class="form-label">Cargo en CIMO</label>
                      <select class="form-select" formControlName="cargo">
                        <option value="">Sin cargo</option>
                        <option value="Presidente del CIMO">Presidente</option>
                        <option value="Vicepresidente del CIMO">Vicepresidente</option>
                        <option value="Secretario del CIMO">Secretario</option>
                        <option value="Tesorero del CIMO">Tesorero</option>
                        <option value="Vocal del CIMO">Vocal</option>
                      </select>
                    </div>

                    <div class="col-md-4">
                      <label class="form-label">Cuota Mensual ($)</label>
                      <input 
                        type="number" 
                        class="form-control"
                        formControlName="cuota_mensual"
                        step="0.01"
                        min="0">
                    </div>

                    <div class="col-12">
                      <label class="form-label">Observaciones</label>
                      <textarea 
                        class="form-control"
                        formControlName="observaciones"
                        rows="2"
                        placeholder="Notas adicionales">
                      </textarea>
                    </div>
                  </div>
                </form>
              }
            </div>

            <!-- Footer -->
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" (click)="onClose()">
                {{ mode === 'view' ? 'Cerrar' : 'Cancelar' }}
              </button>
              @if (mode !== 'view') {
                <button 
                  type="button" 
                  class="btn btn-dark"
                  [disabled]="socioForm.invalid"
                  (click)="onSave()">
                  <i class="fas fa-save me-2"></i>
                  {{ mode === 'create' ? 'Crear Socio' : 'Guardar Cambios' }}
                </button>
              } @else {
                <button type="button" class="btn btn-primary" (click)="switchToEdit()">
                  <i class="fas fa-edit me-2"></i>
                  Editar
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal {
      background: rgba(0, 0, 0, 0.1);
    }

    .avatar-xl {
      width: 120px;
      height: 120px;
    }

    .avatar-initials {
      font-size: 2.5rem;
      font-weight: 600;
    }

    .bg-gradient-primary {
      background: linear-gradient(135deg, #344767 0%, #1a252f 100%);
    }

    .form-label {
      font-weight: 500;
      font-size: 0.875rem;
    }
  `]
})
export class ModalSocioComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() socio: SocioListItem | null = null;
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  socioForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['socio'] || changes['mode'] || changes['isOpen']) {
      if (this.isOpen) {
        this.updateForm();
      }
    }
  }

  private initForm(): void {
    this.socioForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      titulo: [''],
      universidad: [''],
      tipo_membresia: ['regular'],
      cargo: [''],
      cuota_mensual: [25],
      observaciones: ['']
    });
  }

  private updateForm(): void {
    if (this.socio && (this.mode === 'edit' || this.mode === 'view')) {
      const nombres = this.socio.nombre_completo.split(' ');
      this.socioForm.patchValue({
        cedula: this.socio.cedula,
        nombres: nombres.slice(0, Math.ceil(nombres.length / 2)).join(' '),
        apellidos: nombres.slice(Math.ceil(nombres.length / 2)).join(' '),
        email: this.socio.email,
        telefono: this.socio.telefono || '',
        tipo_membresia: this.socio.tipo_membresia,
        cargo: this.socio.cargo || ''
      });
    } else {
      this.socioForm.reset({
        tipo_membresia: 'regular',
        cuota_mensual: 25
      });
    }
  }

  getTitle(): string {
    switch (this.mode) {
      case 'create': return 'Nuevo Socio';
      case 'edit': return 'Editar Socio';
      case 'view': return 'Detalle del Socio';
    }
  }

  getTitleIcon(): string {
    switch (this.mode) {
      case 'create': return 'fas fa-user-plus';
      case 'edit': return 'fas fa-user-edit';
      case 'view': return 'fas fa-user';
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.socioForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  switchToEdit(): void {
    this.mode = 'edit';
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.socioForm.valid) {
      this.save.emit({
        ...this.socioForm.value,
        id_socio: this.socio?.id_socio
      });
    } else {
      Object.keys(this.socioForm.controls).forEach(key => {
        this.socioForm.get(key)?.markAsTouched();
      });
    }
  }
}
