/**
 * Login Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="min-vh-100 d-flex align-items-center">
      <div class="container">
        <div class="row">
          <!-- Formulario de Login -->
          <div class="col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-auto">
            <div class="card card-plain mt-4">
              <div class="card-header pb-0 text-left bg-transparent">
                <div class="text-center mb-4">
                  <img src="assets/img/logocimo.ico" alt="CIMO Logo" class="mb-3" style="height: 80px;">
                </div>
                <h3 class="font-weight-black text-dark display-6 text-center">CIMO</h3>
                <p class="mb-0 text-center text-muted">Sistema de Gestión de Socios</p>
              </div>
              
              <div class="card-body">
                <!-- Alerta de sesión expirada -->
                @if (sessionExpired()) {
                  <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Su sesión ha expirado. Por favor inicie sesión nuevamente.
                    <button type="button" class="btn-close" (click)="sessionExpired.set(false)"></button>
                  </div>
                }

                <!-- Formulario -->
                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                  <div class="mb-3">
                    <label class="form-label">Correo electrónico</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      formControlName="email"
                      placeholder="Ingrese su correo electrónico"
                      [class.is-invalid]="isFieldInvalid('email')"
                      autocomplete="email">
                    @if (isFieldInvalid('email')) {
                      <div class="invalid-feedback">
                        @if (loginForm.get('email')?.errors?.['required']) {
                          El correo electrónico es requerido
                        } @else if (loginForm.get('email')?.errors?.['email']) {
                          Ingrese un correo electrónico válido
                        }
                      </div>
                    }
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Contraseña</label>
                    <div class="input-group">
                      <input 
                        [type]="showPassword() ? 'text' : 'password'" 
                        class="form-control" 
                        formControlName="password"
                        placeholder="Ingrese su contraseña"
                        [class.is-invalid]="isFieldInvalid('password')"
                        autocomplete="current-password">
                      <button 
                        type="button" 
                        class="btn btn-outline-secondary"
                        (click)="togglePasswordVisibility()">
                        <i [class]="showPassword() ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                    @if (isFieldInvalid('password')) {
                      <div class="text-danger small mt-1">
                        @if (loginForm.get('password')?.errors?.['required']) {
                          La contraseña es requerida
                        } @else if (loginForm.get('password')?.errors?.['minlength']) {
                          La contraseña debe tener al menos 6 caracteres
                        }
                      </div>
                    }
                  </div>

                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        formControlName="rememberMe"
                        id="rememberMe">
                      <label class="form-check-label text-dark" for="rememberMe">
                        Recordarme por 14 días
                      </label>
                    </div>
                    <a routerLink="/forgot-password" class="text-xs text-primary">
                      ¿Olvidó su contraseña?
                    </a>
                  </div>

                  <!-- Error de autenticación -->
                  @if (authService.authError()) {
                    <div class="alert alert-danger py-2 mb-3">
                      <i class="fas fa-exclamation-circle me-2"></i>
                      {{ authService.authError() }}
                    </div>
                  }

                  <div class="text-center">
                    <button 
                      type="submit" 
                      class="btn btn-dark w-100 mt-2 mb-3"
                      [disabled]="authService.isLoading() || loginForm.invalid">
                      @if (authService.isLoading()) {
                        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                        Iniciando sesión...
                      } @else {
                        <i class="fas fa-sign-in-alt me-2"></i>
                        Ingresar
                      }
                    </button>
                  </div>
                </form>
              </div>

              <div class="card-footer text-center pt-0 px-lg-2 px-1">
                <p class="mb-2 text-sm text-muted">
                  ¿No eres socio CIMO?
                </p>
                <a routerLink="/register" class="btn btn-outline-dark btn-sm">
                  <i class="fas fa-user-plus me-2"></i>
                  Solicitar Membresía
                </a>
              </div>
            </div>
          </div>
  <!-- Imagen lateral -->
  <div class="col-md-5 d-none d-lg-block p-0">
    <div 
      class="h-100 w-100"
      style="background-image: url('assets/img/cimoFont.PNG');
            background-size: contain;
            background-position: center; 
            background-repeat: no-repeat;">
    </div>
</div>
  `,
  styles: [`
    .card-plain {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
      border-color: #1a252f;
    }

    .input-group .btn {
      border-color: #d2d6da;
    }
  `]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  loginForm!: FormGroup;
  showPassword = signal(false);
  sessionExpired = signal(false);

  ngOnInit(): void {
    this.initForm();
    this.checkSessionExpired();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  private checkSessionExpired(): void {
    const expired = this.route.snapshot.queryParams['sessionExpired'];
    if (expired === 'true') {
      this.sessionExpired.set(true);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Bienvenido al sistema CIMO');
          this.redirectAfterLogin();
        }
      },
      error: () => {
        // El error ya se maneja en el servicio
      }
    });
  }

  private redirectAfterLogin(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    // Redirigir según el rol
    const role = this.authService.getRole();
    
    if (role && this.authService.isDirectiva()) {
      this.router.navigate(['/dashboard']);
    } else if (role === 'socio') {
      this.router.navigate(['/mis-mensualidades']);
    } else {
      this.router.navigate(['/requisitos']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  private markAllAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }
}
