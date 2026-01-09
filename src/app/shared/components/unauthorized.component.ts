/**
 * Unauthorized Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Página de acceso denegado
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-gray-100">
      <div class="text-center">
        <div class="mb-4">
          <i class="fas fa-lock text-danger" style="font-size: 5rem;"></i>
        </div>
        <h1 class="display-4 fw-bold text-dark">403</h1>
        <h4 class="mb-3">Acceso Denegado</h4>
        <p class="text-muted mb-4">
          No tienes permisos para acceder a esta sección.<br>
          Contacta al administrador si crees que esto es un error.
        </p>
        <div class="d-flex gap-2 justify-content-center">
          <a routerLink="/" class="btn btn-dark">
            <i class="fas fa-home me-2"></i>
            Ir al Inicio
          </a>
          <button class="btn btn-outline-secondary" onclick="history.back()">
            <i class="fas fa-arrow-left me-2"></i>
            Volver
          </button>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}
