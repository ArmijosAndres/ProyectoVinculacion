/**
 * Loading Screen Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Pantalla de carga inicial con animación del logo
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="loading-screen"
      [class.fade-out]="isExiting()"
      [class.hidden]="isHidden()">
      <div class="loading-content">
        <!-- Logo con animación -->
        <div class="logo-container">
          <img 
            src="assets/img/logocimo.ico" 
            alt="CIMO Logo"
            class="logo"
            [class.animate]="isAnimating()">
        </div>
        
        <!-- Nombre del sistema -->
        <div class="system-name" [class.show]="showText()">
          <h2>CIMO</h2>
          <p>Sistema de Gestión de Socios</p>
        </div>
        
        <!-- Indicador de carga -->
        <div class="loading-indicator" [class.show]="showIndicator()">
          <div class="spinner"></div>
          <span>Cargando...</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: opacity 0.5s ease, visibility 0.5s ease;
    }

    .loading-screen.fade-out {
      opacity: 0;
    }

    .loading-screen.hidden {
      visibility: hidden;
      pointer-events: none;
    }

    .loading-content {
      text-align: center;
    }

    .logo-container {
      margin-bottom: 2rem;
    }

    .logo {
      width: 120px;
      height: 120px;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .logo.animate {
      opacity: 1;
      transform: scale(1);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        filter: brightness(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
      }
      50% {
        filter: brightness(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4));
      }
    }

    .system-name {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.6s ease;
      color: white;
    }

    .system-name.show {
      opacity: 1;
      transform: translateY(0);
    }

    .system-name h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      letter-spacing: 4px;
    }

    .system-name p {
      font-size: 1rem;
      opacity: 0.7;
      margin: 0;
    }

    .loading-indicator {
      margin-top: 2rem;
      opacity: 0;
      transition: opacity 0.4s ease;
      color: rgba(255, 255, 255, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .loading-indicator.show {
      opacity: 1;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoadingScreenComponent implements OnInit {
  @Output() loadingComplete = new EventEmitter<void>();

  isAnimating = signal(false);
  showText = signal(false);
  showIndicator = signal(false);
  isExiting = signal(false);
  isHidden = signal(false);

  ngOnInit(): void {
    this.startAnimation();
  }

  private startAnimation(): void {
    // Paso 1: Animar logo
    setTimeout(() => {
      this.isAnimating.set(true);
    }, 100);

    // Paso 2: Mostrar texto
    setTimeout(() => {
      this.showText.set(true);
    }, 600);

    // Paso 3: Mostrar indicador de carga
    setTimeout(() => {
      this.showIndicator.set(true);
    }, 1000);

    // Paso 4: Iniciar fade out
    setTimeout(() => {
      this.isExiting.set(true);
    }, 2200);

    // Paso 5: Ocultar completamente y emitir evento
    setTimeout(() => {
      this.isHidden.set(true);
      this.loadingComplete.emit();
    }, 2700);
  }
}
