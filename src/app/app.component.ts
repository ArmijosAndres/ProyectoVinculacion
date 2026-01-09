/**
 * App Component - Componente Raíz
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Componente principal que maneja el layout según estado de autenticación
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { LoadingScreenComponent } from './shared/components/loading-screen.component';
import { MainLayoutComponent } from './shared/components/main-layout.component';
import { ToastNotificationsComponent } from './shared/components/toast-notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoadingScreenComponent,
    MainLayoutComponent,
    ToastNotificationsComponent
  ],
  template: `
    <!-- Loading Screen (solo al inicio) -->
    @if (showLoadingScreen()) {
      <app-loading-screen (loadingComplete)="onLoadingComplete()"></app-loading-screen>
    }

    <!-- Toast Notifications -->
    <app-toast-notifications></app-toast-notifications>

    <!-- Contenido Principal -->
    @if (!showLoadingScreen()) {
      @if (isAuthRoute()) {
        <!-- Rutas de autenticación sin layout -->
        <router-outlet></router-outlet>
      } @else if (authService.isAuthenticated()) {
        <!-- Rutas protegidas con layout completo -->
        <app-main-layout></app-main-layout>
      } @else {
        <!-- Fallback - redirigir a login -->
        <router-outlet></router-outlet>
      }
    }
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  protected authService = inject(AuthService);
  private router = inject(Router);

  showLoadingScreen = signal(true);
  currentRoute = signal('');

  // Rutas que no necesitan el layout principal
  private authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/unauthorized'];

  isAuthRoute = computed(() => {
    const route = this.currentRoute();
    return this.authRoutes.some(r => route.startsWith(r));
  });

  ngOnInit(): void {
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute.set(event.urlAfterRedirects);
    });

    // Establecer ruta inicial
    this.currentRoute.set(this.router.url);
  }

  onLoadingComplete(): void {
    this.showLoadingScreen.set(false);
  }
}
