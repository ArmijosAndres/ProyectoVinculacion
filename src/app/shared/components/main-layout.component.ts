/**
 * Main Layout Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Layout principal que incluye sidebar, header y footer
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, signal, inject, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { RoleName } from '../../core/models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: RoleName[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Sidebar -->
    <aside 
      class="sidenav navbar navbar-vertical navbar-expand-xs border-0 fixed-start"
      [class.show]="!sidebarCollapsed()"
      id="sidenav-main">
      
      <!-- Logo y título -->
      <div class="sidenav-header">
        <a class="navbar-brand d-flex align-items-center m-0" routerLink="/">
          <img src="assets/img/logocimo.ico" class="navbar-brand-img" style="height: 40px;" alt="CIMO Logo">
          <span class="ms-2 font-weight-bold text-white">Socios CIMO</span>
        </a>
        
        <!-- Toggle button for mobile -->
        <button 
          class="btn btn-link text-white d-xl-none position-absolute end-0 top-0 mt-3 me-2"
          (click)="toggleSidebar()">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Navigation Menu -->
      <div class="collapse navbar-collapse w-auto show" id="sidenav-collapse-main">
        <ul class="navbar-nav">
          @for (item of visibleMenuItems(); track item.route) {
            <li class="nav-item">
              <a 
                class="nav-link" 
                [routerLink]="item.route" 
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }">
                <div class="icon icon-shape icon-sm px-0 text-center d-flex align-items-center justify-content-center">
                  <i [class]="item.icon" style="font-size: 16px;"></i>
                </div>
                <span class="nav-link-text ms-2">{{ item.label }}</span>
              </a>
            </li>
          }
        </ul>

        <!-- User Section -->
        <div class="mt-auto px-4 pb-4">
          <hr class="horizontal light mt-0">
          <div class="d-flex align-items-center">
            <div class="avatar avatar-sm rounded-circle bg-white text-dark d-flex align-items-center justify-content-center">
              <i class="fas fa-user"></i>
            </div>
            <div class="ms-2 text-white">
              <p class="mb-0 small fw-bold text-truncate" style="max-width: 140px;">
                {{ authService.userName() }}
              </p>
              <p class="mb-0 small opacity-75 text-capitalize">
                {{ authService.userRole() }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
      
      <!-- Header -->
      <nav class="navbar navbar-main navbar-expand-lg mx-4 px-0 shadow-none rounded" id="navbarBlur">
        <div class="container-fluid py-1 px-2">
          <!-- Mobile Toggle -->
          <button 
            class="btn btn-link nav-link text-body p-0 d-xl-none"
            (click)="toggleSidebar()">
            <i class="fas fa-bars"></i>
          </button>

          <!-- Breadcrumb -->
          <nav aria-label="breadcrumb">
            <h6 class="font-weight-bold mb-0">{{ currentPageTitle() }}</h6>
          </nav>

          <!-- Right Side Actions -->
          <div class="collapse navbar-collapse justify-content-end" id="navbar">
            <!-- Search -->
            <div class="ms-md-auto pe-md-3 d-none d-lg-flex">
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-white border-end-0">
                  <i class="fas fa-search text-muted"></i>
                </span>
                <input type="text" class="form-control ps-0 border-start-0" placeholder="Buscar...">
              </div>
            </div>

            <!-- Actions -->
            <ul class="navbar-nav">
              <!-- Notifications -->
              <li class="nav-item dropdown">
                <a class="nav-link text-body p-0 position-relative" href="#" id="notifDropdown" 
                   data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-bell" style="font-size: 1.2rem;"></i>
                  @if (hasNotifications()) {
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {{ notificationCount() }}
                    </span>
                  }
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="notifDropdown">
                  <li><h6 class="dropdown-header">Notificaciones</h6></li>
                  <li><a class="dropdown-item" href="#">Sin notificaciones nuevas</a></li>
                </ul>
              </li>

              <!-- User Menu -->
              <li class="nav-item dropdown ps-3">
                <a class="nav-link text-body p-0" href="#" id="userDropdown" 
                   data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-user-circle" style="font-size: 1.5rem;"></i>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <div class="dropdown-header">
                      <strong>{{ authService.userName() }}</strong>
                      <br>
                      <small class="text-muted text-capitalize">{{ authService.userRole() }}</small>
                    </div>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" routerLink="/perfil">
                    <i class="fas fa-user me-2"></i>Mi Perfil
                  </a></li>
                  <li><a class="dropdown-item" routerLink="/configuracion">
                    <i class="fas fa-cog me-2"></i>Configuración
                  </a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item text-danger" href="#" (click)="logout($event)">
                      <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Page Content -->
      <div class="container-fluid py-4 px-4">
        <router-outlet></router-outlet>
      </div>

      <!-- Footer -->
      <footer class="footer pt-3 px-4">
        <div class="container-fluid">
          <div class="row align-items-center justify-content-lg-between">
            <div class="col-lg-6 mb-lg-0 mb-4">
              <div class="copyright text-center text-xs text-muted text-lg-start">
                © {{ currentYear }} Colegio de Ingenieros Mecánicos de El Oro - 
                <a href="https://www.cimo.com.ec" class="text-secondary" target="_blank">CIMO</a>
              </div>
            </div>
            <div class="col-lg-6">
              <ul class="nav nav-footer justify-content-center justify-content-lg-end">
                <li class="nav-item">
                  <a href="#" class="nav-link text-xs text-muted">Sobre Nosotros</a>
                </li>
                <li class="nav-item">
                  <a href="#" class="nav-link text-xs text-muted">Soporte</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>

    <!-- Overlay for mobile sidebar -->
    @if (!sidebarCollapsed()) {
      <div class="sidenav-overlay d-xl-none" (click)="toggleSidebar()"></div>
    }
  `,
styles: [`
    :host {
      display: block;
    }

    .sidenav {
      background-color: #0f172a !important;
      width: 250px;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      overflow-y: auto;
      transition: transform 0.3s ease;
      z-index: 1040;
      display: flex;
      flex-direction: column;
    }

    .sidenav-header {
      padding: 1.5rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }

    .sidenav .navbar-collapse {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .sidenav .navbar-nav {
      flex: 1;
      padding: 1rem 0;
      width: 100%;
    }

    .sidenav .nav-item {
      width: 100%;
    }

    .sidenav .nav-link {
      color: rgba(255, 255, 255, 0.8) !important;
      padding: 0.75rem 1rem;
      margin: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }

    .sidenav .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white !important;
    }

    .sidenav .nav-link.active {
      background-color: rgba(255, 255, 255, 0.15);
      color: white !important;
    }

    .sidenav .nav-link .icon-shape {
      min-width: 32px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sidenav .nav-link-text {
      margin-left: 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .main-content {
      margin-left: 250px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f8f9fa;
    }

    .main-content > .container-fluid {
      flex: 1;
    }

    .navbar-main {
      background-color: #f8f9fa;
    }

    .sidenav-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1039;
    }

    .user-section {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }

    @media (max-width: 1199.98px) {
      .sidenav {
        transform: translateX(-100%);
      }

      .sidenav.show {
        transform: translateX(0);
      }

      .main-content {
        margin-left: 0 !important;
      }
    }

    .avatar {
      width: 36px;
      height: 36px;
    }

    .footer {
      margin-top: auto;
      background-color: #f8f9fa;
    }
  `]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  protected authService = inject(AuthService);
  private router = inject(Router);
  
  private routerSub?: Subscription;

  sidebarCollapsed = signal(true);
  currentPageTitle = signal('Dashboard');
  hasNotifications = signal(false);
  notificationCount = signal(0);
  currentYear = new Date().getFullYear();

  // Definición de menú con roles
  private menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-chart-pie',
      route: '/dashboard',
      roles: ['presidente', 'vicepresidente', 'secretario', 'tesorero', 'vocal']
    },
    {
      label: 'Mis Mensualidades',
      icon: 'fas fa-wallet',
      route: '/mis-mensualidades',
      roles: ['presidente', 'vicepresidente', 'secretario', 'tesorero', 'vocal', 'socio']
    },
    {
      label: 'Socios',
      icon: 'fas fa-users',
      route: '/socios',
      roles: ['presidente', 'vicepresidente', 'secretario', 'tesorero', 'vocal']
    },
    {
      label: 'Registrar Pago',
      icon: 'fas fa-dollar-sign',
      route: '/pagos/registrar',
      roles: ['presidente', 'vicepresidente', 'secretario', 'tesorero', 'vocal', 'socio']
    },
    {
      label: 'Aprobar Pagos',
      icon: 'fas fa-check-circle',
      route: '/pagos/aprobar',
      roles: ['presidente', 'tesorero']
    },
    {
      label: 'Reportes',
      icon: 'fas fa-chart-line',
      route: '/reportes',
      roles: ['presidente', 'vicepresidente', 'secretario', 'tesorero']
    },
    {
      label: 'Solicitudes',
      icon: 'fas fa-user-plus',
      route: '/solicitudes',
      roles: ['presidente', 'vicepresidente', 'secretario']
    }
  ];

  // Menú filtrado según el rol del usuario
  visibleMenuItems = computed(() => {
    const userRole = this.authService.userRole();
    if (!userRole) return [];
    
    return this.menuItems.filter(item => item.roles.includes(userRole));
  });

  ngOnInit(): void {
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageTitle();
      // Cerrar sidebar en móvil al navegar
      if (window.innerWidth < 1200) {
        this.sidebarCollapsed.set(true);
      }
    });

    this.updatePageTitle();
    
    // En desktop, mostrar sidebar por defecto
    if (window.innerWidth >= 1200) {
      this.sidebarCollapsed.set(false);
    }
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout().subscribe();
  }

  private updatePageTitle(): void {
    const currentUrl = this.router.url;
    const menuItem = this.menuItems.find(item => currentUrl.startsWith(item.route));
    this.currentPageTitle.set(menuItem?.label || 'CIMO');
  }
}
