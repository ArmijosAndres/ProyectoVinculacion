/**
 * Register Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="min-vh-100 d-flex align-items-center py-5">
      <div class="container">
        <div class="row">
          <div class="col-xl-6 col-lg-7 col-md-9 mx-auto">
            <div class="card shadow-lg">
              <div class="card-header text-center bg-dark text-white py-4">
                <img src="assets/img/logocimo.ico" alt="CIMO Logo" class="mb-2" style="height: 60px;">
                <h4 class="mb-1">Solicitud de Membresía</h4>
                <p class="mb-0 small opacity-75">Colegio de Ingenieros Mecánicos de El Oro</p>
              </div>
              
              <div class="card-body p-4">
                <!-- Stepper Indicator -->
                <div class="d-flex justify-content-center mb-4">
                  @for (step of steps; track step.number) {
                    <div class="d-flex align-items-center">
                      <div 
                        class="step-indicator rounded-circle d-flex align-items-center justify-content-center"
                        [class.active]="currentStep() === step.number"
                        [class.completed]="currentStep() > step.number">
                        @if (currentStep() > step.number) {
                          <i class="fas fa-check"></i>
                        } @else {
                          {{ step.number }}
                        }
                      </div>
                      <span class="ms-2 me-3 d-none d-md-inline small" 
                            [class.text-dark]="currentStep() >= step.number"
                            [class.text-muted]="currentStep() < step.number">
                        {{ step.label }}
                      </span>
                      @if (step.number < 3) {
                        <div class="step-line"></div>
                      }
                    </div>
                  }
                </div>

                <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                  <!-- Step 1: Datos Personales -->
                  @if (currentStep() === 1) {
                    <div class="step-content" @fadeIn>
                      <h5 class="mb-4 text-center">Datos Personales</h5>
                      
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Cédula de Identidad *</label>
                          <input 
                            type="text" 
                            class="form-control" 
                            formControlName="cedula"
                            placeholder="0701234567"
                            maxlength="10"
                            [class.is-invalid]="isFieldInvalid('cedula')">
                          @if (isFieldInvalid('cedula')) {
                            <div class="invalid-feedback">
                              Ingrese una cédula válida de 10 dígitos
                            </div>
                          }
                        </div>
                        
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Fecha de Nacimiento</label>
                          <input 
                            type="date" 
                            class="form-control" 
                            formControlName="fecha_nacimiento"
                            [class.is-invalid]="isFieldInvalid('fecha_nacimiento')">
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Nombres *</label>
                          <input 
                            type="text" 
                            class="form-control" 
                            formControlName="nombres"
                            placeholder="Ingrese sus nombres"
                            [class.is-invalid]="isFieldInvalid('nombres')">
                          @if (isFieldInvalid('nombres')) {
                            <div class="invalid-feedback">Los nombres son requeridos</div>
                          }
                        </div>
                        
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Apellidos *</label>
                          <input 
                            type="text" 
                            class="form-control" 
                            formControlName="apellidos"
                            placeholder="Ingrese sus apellidos"
                            [class.is-invalid]="isFieldInvalid('apellidos')">
                          @if (isFieldInvalid('apellidos')) {
                            <div class="invalid-feedback">Los apellidos son requeridos</div>
                          }
                        </div>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Dirección</label>
                        <textarea 
                          class="form-control" 
                          formControlName="direccion"
                          placeholder="Ingrese su dirección completa"
                          rows="2">
                        </textarea>
                      </div>
                    </div>
                  }

                  <!-- Step 2: Contacto -->
                  @if (currentStep() === 2) {
                    <div class="step-content" @fadeIn>
                      <h5 class="mb-4 text-center">Información de Contacto</h5>
                      
                      <div class="mb-3">
                        <label class="form-label">Correo Electrónico *</label>
                        <input 
                          type="email" 
                          class="form-control" 
                          formControlName="email"
                          placeholder="correo@ejemplo.com"
                          [class.is-invalid]="isFieldInvalid('email')">
                        @if (isFieldInvalid('email')) {
                          <div class="invalid-feedback">
                            @if (registerForm.get('email')?.errors?.['required']) {
                              El correo electrónico es requerido
                            } @else {
                              Ingrese un correo electrónico válido
                            }
                          </div>
                        }
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Teléfono / Celular</label>
                        <input 
                          type="tel" 
                          class="form-control" 
                          formControlName="telefono"
                          placeholder="0991234567"
                          maxlength="10">
                      </div>
                    </div>
                  }

                  <!-- Step 3: Credenciales -->
                  @if (currentStep() === 3) {
                    <div class="step-content" @fadeIn>
                      <h5 class="mb-4 text-center">Crear Contraseña</h5>
                      
                      <div class="mb-3">
                        <label class="form-label">Contraseña *</label>
                        <div class="input-group">
                          <input 
                            [type]="showPassword() ? 'text' : 'password'" 
                            class="form-control" 
                            formControlName="password"
                            placeholder="Mínimo 8 caracteres"
                            [class.is-invalid]="isFieldInvalid('password')">
                          <button 
                            type="button" 
                            class="btn btn-outline-secondary"
                            (click)="togglePassword()">
                            <i [class]="showPassword() ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                          </button>
                        </div>
                        @if (isFieldInvalid('password')) {
                          <div class="text-danger small mt-1">
                            La contraseña debe tener al menos 8 caracteres
                          </div>
                        }
                        
                        <!-- Password Strength Indicator -->
                        <div class="password-strength mt-2">
                          <div class="progress" style="height: 4px;">
                            <div 
                              class="progress-bar" 
                              [style.width.%]="passwordStrength()"
                              [class.bg-danger]="passwordStrength() < 40"
                              [class.bg-warning]="passwordStrength() >= 40 && passwordStrength() < 70"
                              [class.bg-success]="passwordStrength() >= 70">
                            </div>
                          </div>
                          <small class="text-muted">
                            Fortaleza: {{ passwordStrengthLabel() }}
                          </small>
                        </div>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Confirmar Contraseña *</label>
                        <input 
                          [type]="showPassword() ? 'text' : 'password'" 
                          class="form-control" 
                          formControlName="password_confirmation"
                          placeholder="Repita su contraseña"
                          [class.is-invalid]="isFieldInvalid('password_confirmation')">
                        @if (isFieldInvalid('password_confirmation')) {
                          <div class="invalid-feedback">Las contraseñas no coinciden</div>
                        }
                      </div>

                      <div class="form-check mb-3">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          formControlName="acceptTerms"
                          id="acceptTerms">
                        <label class="form-check-label" for="acceptTerms">
                          Acepto los <a href="#" class="text-primary">términos y condiciones</a> 
                          y la <a href="#" class="text-primary">política de privacidad</a>
                        </label>
                      </div>
                    </div>
                  }

                  <!-- Botones de navegación -->
                  <div class="d-flex justify-content-between mt-4 pt-3 border-top">
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      [disabled]="currentStep() === 1"
                      (click)="previousStep()">
                      <i class="fas fa-arrow-left me-2"></i>
                      Anterior
                    </button>

                    @if (currentStep() < 3) {
                      <button 
                        type="button" 
                        class="btn btn-dark"
                        (click)="nextStep()">
                        Siguiente
                        <i class="fas fa-arrow-right ms-2"></i>
                      </button>
                    } @else {
                      <button 
                        type="submit" 
                        class="btn btn-success"
                        [disabled]="isLoading() || registerForm.invalid">
                        @if (isLoading()) {
                          <span class="spinner-border spinner-border-sm me-2"></span>
                          Enviando...
                        } @else {
                          <i class="fas fa-paper-plane me-2"></i>
                          Enviar Solicitud
                        }
                      </button>
                    }
                  </div>
                </form>
              </div>

              <div class="card-footer text-center py-3">
                <span class="text-muted">¿Ya tienes cuenta?</span>
                <a routerLink="/login" class="ms-2 text-dark fw-bold">Iniciar Sesión</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .step-indicator {
      width: 32px;
      height: 32px;
      background: #e9ecef;
      color: #6c757d;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .step-indicator.active {
      background: #344767;
      color: white;
    }

    .step-indicator.completed {
      background: #198754;
      color: white;
    }

    .step-line {
      width: 40px;
      height: 2px;
      background: #e9ecef;
      margin: 0 8px;
    }

    .card {
      border: none;
      border-radius: 1rem;
    }

    .card-header {
      border-radius: 1rem 1rem 0 0 !important;
    }

    .form-control:focus {
      border-color: #344767;
      box-shadow: 0 0 0 0.2rem rgba(52, 71, 103, 0.15);
    }

    .btn-dark {
      background-color: #344767;
      border-color: #344767;
    }

    .btn-dark:hover {
      background-color: #1a252f;
    }
  `]
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  registerForm!: FormGroup;
  currentStep = signal(1);
  showPassword = signal(false);
  isLoading = signal(false);

  steps = [
    { number: 1, label: 'Datos Personales' },
    { number: 2, label: 'Contacto' },
    { number: 3, label: 'Credenciales' }
  ];

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      // Step 1
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      fecha_nacimiento: [''],
      direccion: [''],
      // Step 2
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      // Step 3
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmation = control.get('password_confirmation');
    
    if (password && confirmation && password.value !== confirmation.value) {
      confirmation.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep.update(step => Math.min(step + 1, 3));
    }
  }

  previousStep(): void {
    this.currentStep.update(step => Math.max(step - 1, 1));
  }

  private validateCurrentStep(): boolean {
    const fieldsPerStep: Record<number, string[]> = {
      1: ['cedula', 'nombres', 'apellidos'],
      2: ['email'],
      3: ['password', 'password_confirmation', 'acceptTerms']
    };

    const fields = fieldsPerStep[this.currentStep()];
    let isValid = true;

    fields.forEach(field => {
      const control = this.registerForm.get(field);
      if (control) {
        control.markAsTouched();
        if (control.invalid) isValid = false;
      }
    });

    return isValid;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formData = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success(
            'Solicitud enviada correctamente. Recibirá un correo cuando sea aprobada.',
            'Registro Exitoso'
          );
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  private markAllAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  passwordStrength(): number {
    const password = this.registerForm.get('password')?.value || '';
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
    
    return Math.min(strength, 100);
  }

  passwordStrengthLabel(): string {
    const strength = this.passwordStrength();
    if (strength < 40) return 'Débil';
    if (strength < 70) return 'Media';
    return 'Fuerte';
  }
}
