/**
 * Mi Perfil Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="row">
      <!-- Información del Usuario -->
      <div class="col-lg-4 mb-4">
        <div class="card border shadow-xs h-100">
          <div class="card-body text-center">
            <div class="avatar avatar-xl bg-gradient-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
              <i class="fas fa-user text-white" style="font-size: 2rem;"></i>
            </div>
            <h5 class="mb-1">{{ authService.userName() }}</h5>
            <p class="text-muted text-capitalize mb-3">{{ authService.userRole() }}</p>
            
            <div class="d-flex justify-content-center gap-4 mb-3">
              <div class="text-center">
                <h6 class="mb-0">{{ currentUser()?.numero_socio || 'N/A' }}</h6>
                <small class="text-muted">N° Socio</small>
              </div>
              <div class="text-center">
                <h6 class="mb-0 text-success">Activo</h6>
                <small class="text-muted">Estado</small>
              </div>
            </div>

            <hr>
            
            <div class="text-start">
              <p class="text-sm mb-2">
                <i class="fas fa-envelope me-2 text-muted"></i>
                {{ currentUser()?.email }}
              </p>
              <p class="text-sm mb-2">
                <i class="fas fa-id-card me-2 text-muted"></i>
                {{ currentUser()?.cedula }}
              </p>
              <p class="text-sm mb-0">
                <i class="fas fa-phone me-2 text-muted"></i>
                {{ currentUser()?.telefono || 'No registrado' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario de Edición -->
      <div class="col-lg-8">
        <div class="card border shadow-xs">
          <div class="card-header border-bottom">
            <h6 class="mb-0">
              <i class="fas fa-edit me-2"></i>
              Editar Información Personal
            </h6>
          </div>
          <div class="card-body">
            <form [formGroup]="perfilForm" (ngSubmit)="onSubmit()">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nombres</label>
                  <input 
                    type="text" 
                    class="form-control"
                    formControlName="nombres"
                    [class.is-invalid]="isFieldInvalid('nombres')">
                  @if (isFieldInvalid('nombres')) {
                    <div class="invalid-feedback">Los nombres son requeridos</div>
                  }
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Apellidos</label>
                  <input 
                    type="text" 
                    class="form-control"
                    formControlName="apellidos"
                    [class.is-invalid]="isFieldInvalid('apellidos')">
                  @if (isFieldInvalid('apellidos')) {
                    <div class="invalid-feedback">Los apellidos son requeridos</div>
                  }
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Cédula</label>
                  <input 
                    type="text" 
                    class="form-control bg-light"
                    formControlName="cedula"
                    readonly>
                  <small class="text-muted">La cédula no se puede modificar</small>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control"
                    formControlName="email"
                    [class.is-invalid]="isFieldInvalid('email')">
                  @if (isFieldInvalid('email')) {
                    <div class="invalid-feedback">Ingrese un email válido</div>
                  }
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Teléfono</label>
                  <input 
                    type="tel" 
                    class="form-control"
                    formControlName="telefono"
                    placeholder="0991234567">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Dirección</label>
                  <input 
                    type="text" 
                    class="form-control"
                    formControlName="direccion"
                    placeholder="Ciudad, Provincia">
                </div>
              </div>

              <hr class="my-4">

              <h6 class="mb-3">
                <i class="fas fa-lock me-2"></i>
                Cambiar Contraseña
              </h6>
              <p class="text-sm text-muted mb-3">Deja en blanco si no deseas cambiar la contraseña</p>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nueva Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control"
                    formControlName="password"
                    placeholder="••••••••">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Confirmar Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control"
                    formControlName="password_confirmation"
                    placeholder="••••••••">
                </div>
              </div>

              <div class="d-flex justify-content-end gap-2 mt-4">
                <button 
                  type="button" 
                  class="btn btn-outline-secondary"
                  (click)="resetForm()">
                  <i class="fas fa-undo me-2"></i>
                  Restablecer
                </button>
                <button 
                  type="submit" 
                  class="btn btn-dark"
                  [disabled]="isSubmitting() || perfilForm.invalid">
                  @if (isSubmitting()) {
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  } @else {
                    <i class="fas fa-save me-2"></i>
                    Guardar Cambios
                  }
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Opción de Darse de Baja -->
        <div class="card border border-danger shadow-xs mt-4">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h6 class="text-danger mb-1">
                  <i class="fas fa-user-slash me-2"></i>
                  Darse de Baja
                </h6>
                <p class="text-sm text-muted mb-0">
                  Solicitar la baja como socio del Colegio de Ingenieros Mecánicos
                </p>
              </div>
              <button 
                class="btn btn-outline-danger btn-sm"
                (click)="solicitarBaja()">
                Solicitar Baja
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirmar Baja -->
    @if (showBajaModal()) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 class="modal-title text-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Confirmar Solicitud de Baja
              </h5>
              <button type="button" class="btn-close" (click)="closeBajaModal()"></button>
            </div>
            <div class="modal-body">
              <p>¿Está seguro que desea solicitar la baja como socio del CIMO?</p>
              <p class="text-muted small">Esta acción enviará una solicitud a la directiva para su revisión. Una vez aprobada, perderá acceso al sistema y los beneficios de membresía.</p>
              
              <div class="mb-3">
                <label class="form-label">Motivo de la baja (opcional)</label>
                <textarea 
                  class="form-control"
                  [(ngModel)]="motivoBaja"
                  rows="3"
                  placeholder="Indique el motivo de su solicitud...">
                </textarea>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-outline-secondary" (click)="closeBajaModal()">Cancelar</button>
              <button class="btn btn-danger" (click)="confirmarBaja()">
                <i class="fas fa-check me-2"></i>
                Confirmar Solicitud
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .avatar-xl {
      width: 100px;
      height: 100px;
    }

    .bg-gradient-primary {
      background: linear-gradient(135deg, #344767 0%, #1a252f 100%);
    }
  `]
})
export class MiPerfilComponent implements OnInit {
  protected authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  perfilForm!: FormGroup;
  isSubmitting = signal(false);
  showBajaModal = signal(false);
  motivoBaja = '';

  currentUser = signal<any>(null);

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
  }

  private initForm(): void {
    this.perfilForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      cedula: [''],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      password: [''],
      password_confirmation: ['']
    });
  }

  private loadUserData(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.currentUser.set({
        ...user,
        numero_socio: 'CIMO-2025-002' // Esto vendrá del backend
      });
      
      this.perfilForm.patchValue({
        nombres: user.nombres,
        apellidos: user.apellidos,
        cedula: user.cedula,
        email: user.email,
        telefono: user.telefono || '',
        direccion: user.direccion || ''
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.perfilForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit(): void {
    if (this.perfilForm.invalid) {
      Object.keys(this.perfilForm.controls).forEach(key => {
        this.perfilForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting.set(true);

    // Simular guardado
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.notificationService.success('Perfil actualizado correctamente');
    }, 1500);
  }

  resetForm(): void {
    this.loadUserData();
    this.notificationService.info('Formulario restablecido');
  }

  solicitarBaja(): void {
    this.showBajaModal.set(true);
    this.motivoBaja = '';
  }

  closeBajaModal(): void {
    this.showBajaModal.set(false);
  }

  confirmarBaja(): void {
    this.closeBajaModal();
    this.notificationService.success(
      'Su solicitud de baja ha sido enviada a la directiva para su revisión',
      'Solicitud Enviada'
    );
  }
}
