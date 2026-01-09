/**
 * Registrar Pago Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Formulario para registrar comprobantes de pago
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PagosService } from '../services/pagos.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { getMesesSelector, getAniosSelector, MetodoPago } from '../../../core/models/pago.model';

@Component({
  selector: 'app-registrar-pago',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-lg-8 col-xl-6">
        <div class="card border shadow-xs">
          <div class="card-header border-bottom">
            <h5 class="mb-1">
              <i class="fas fa-dollar-sign me-2"></i>
              Registrar Pago de Mensualidad
            </h5>
            <p class="text-sm text-muted mb-0">
              Sube el comprobante de tu transferencia o depósito
            </p>
          </div>
          
          <div class="card-body">
            <form [formGroup]="pagoForm" (ngSubmit)="onSubmit()">
              <!-- Período -->
              <div class="row mb-4">
                <div class="col-md-6 mb-3 mb-md-0">
                  <label class="form-label">Mes *</label>
                  <select 
                    class="form-select"
                    formControlName="mes"
                    [class.is-invalid]="isFieldInvalid('mes')">
                    <option value="">Seleccione el mes</option>
                    @for (mes of meses; track mes.value) {
                      <option [value]="mes.value">{{ mes.label }}</option>
                    }
                  </select>
                  @if (isFieldInvalid('mes')) {
                    <div class="invalid-feedback">Seleccione un mes</div>
                  }
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Año *</label>
                  <select 
                    class="form-select"
                    formControlName="anio"
                    [class.is-invalid]="isFieldInvalid('anio')">
                    @for (anio of anios; track anio) {
                      <option [value]="anio">{{ anio }}</option>
                    }
                  </select>
                </div>
              </div>

              <!-- Monto y Fecha -->
              <div class="row mb-4">
                <div class="col-md-6 mb-3 mb-md-0">
                  <label class="form-label">Monto *</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input 
                      type="number" 
                      class="form-control"
                      formControlName="monto"
                      placeholder="0.00"
                      step="0.01"
                      [class.is-invalid]="isFieldInvalid('monto')">
                  </div>
                  @if (isFieldInvalid('monto')) {
                    <div class="text-danger small mt-1">Ingrese un monto válido</div>
                  }
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Fecha de Pago *</label>
                  <input 
                    type="date" 
                    class="form-control"
                    formControlName="fecha_pago"
                    [class.is-invalid]="isFieldInvalid('fecha_pago')">
                  @if (isFieldInvalid('fecha_pago')) {
                    <div class="invalid-feedback">Ingrese la fecha del pago</div>
                  }
                </div>
              </div>

              <!-- Upload de Comprobante -->
              <div class="mb-4">
                <label class="form-label">Imagen del Comprobante *</label>
                <div 
                  class="upload-area p-4 text-center border rounded-3"
                  [class.border-primary]="isDragging()"
                  [class.border-success]="selectedFile()"
                  (dragover)="onDragOver($event)"
                  (dragleave)="onDragLeave($event)"
                  (drop)="onDrop($event)">
                  
                  @if (!selectedFile()) {
                    <i class="fas fa-cloud-upload-alt text-muted mb-3" style="font-size: 3rem;"></i>
                    <p class="mb-2">Arrastra y suelta tu comprobante aquí</p>
                    <p class="text-muted small mb-3">o</p>
                    <label class="btn btn-outline-primary btn-sm">
                      <i class="fas fa-folder-open me-2"></i>
                      Seleccionar archivo
                      <input 
                        type="file" 
                        class="d-none"
                        accept="image/jpeg,image/png,image/gif"
                        (change)="onFileSelected($event)">
                    </label>
                    <p class="text-muted small mt-2 mb-0">JPG, PNG o GIF. Máximo 5MB</p>
                  } @else {
                    <div class="selected-file">
                      <i class="fas fa-file-image text-success mb-2" style="font-size: 2rem;"></i>
                      <p class="mb-1 fw-bold">{{ selectedFile()!.name }}</p>
                      <p class="text-muted small mb-2">{{ formatFileSize(selectedFile()!.size) }}</p>
                      <button 
                        type="button" 
                        class="btn btn-sm btn-outline-danger"
                        (click)="removeFile()">
                        <i class="fas fa-times me-1"></i>
                        Eliminar
                      </button>
                    </div>
                  }
                </div>
                @if (fileError()) {
                  <div class="text-danger small mt-2">{{ fileError() }}</div>
                }
              </div>

              <!-- Observaciones -->
              <div class="mb-4">
                <label class="form-label">Observaciones</label>
                <textarea 
                  class="form-control"
                  formControlName="observaciones"
                  rows="2"
                  placeholder="Información adicional (opcional)">
                </textarea>
              </div>

              <!-- Botones -->
              <div class="d-flex gap-2">
                <button 
                  type="button" 
                  class="btn btn-outline-secondary"
                  (click)="cancel()">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  class="btn btn-dark flex-grow-1"
                  [disabled]="isSubmitting() || pagoForm.invalid || !selectedFile()">
                  @if (isSubmitting()) {
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Enviando...
                  } @else {
                    <i class="fas fa-paper-plane me-2"></i>
                    Enviar Comprobante
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upload-area {
      background: #f8f9fa;
      border: 2px dashed #dee2e6 !important;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .upload-area:hover,
    .upload-area.border-primary {
      border-color: #344767 !important;
      background: #f0f4f8;
    }

    .upload-area.border-success {
      border-color: #198754 !important;
      background: #f0fff4;
    }

  `]
})
export class RegistrarPagoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private pagosService = inject(PagosService);
  private notificationService = inject(NotificationService);

  pagoForm!: FormGroup;
  meses = getMesesSelector();
  anios = getAniosSelector();
  
  selectedFile = signal<File | null>(null);
  isDragging = signal(false);
  fileError = signal<string | null>(null);
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.initForm();
    this.loadQueryParams();
  }

  private initForm(): void {
    const currentDate = new Date();
    
    this.pagoForm = this.fb.group({
      mes: ['', Validators.required],
      anio: [currentDate.getFullYear(), Validators.required],
      monto: [25, [Validators.required, Validators.min(0.01)]],
      fecha_pago: [this.formatDate(currentDate), Validators.required],
      observaciones: ['']
    });
  }

  private loadQueryParams(): void {
    const mes = this.route.snapshot.queryParams['mes'];
    const anio = this.route.snapshot.queryParams['anio'];
    
    if (mes) this.pagoForm.patchValue({ mes: parseInt(mes) });
    if (anio) this.pagoForm.patchValue({ anio: parseInt(anio) });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.validateAndSetFile(event.dataTransfer.files[0]);
    }
  }

  private validateAndSetFile(file: File): void {
    this.fileError.set(null);
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.fileError.set('Solo se permiten imágenes (JPG, PNG, GIF)');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.fileError.set('El archivo no debe superar los 5MB');
      return;
    }

    this.selectedFile.set(file);
  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.fileError.set(null);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.pagoForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit(): void {
    if (this.pagoForm.invalid || !this.selectedFile()) {
      Object.keys(this.pagoForm.controls).forEach(key => {
        this.pagoForm.get(key)?.markAsTouched();
      });
      
      if (!this.selectedFile()) {
        this.fileError.set('Debe adjuntar el comprobante de pago');
      }
      return;
    }

    this.isSubmitting.set(true);

    const formData = {
      ...this.pagoForm.value,
      comprobante: this.selectedFile()
    };

    this.pagosService.createPago(formData).subscribe({
      next: () => {
        this.notificationService.success(
          'Tu pago ha sido registrado y está pendiente de aprobación',
          'Pago Registrado'
        );
        this.router.navigate(['/mis-mensualidades']);
      },
      error: () => {
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/mis-mensualidades']);
  }
}
