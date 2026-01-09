/**
 * Toast Notifications Component
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Muestra notificaciones toast en la esquina de la pantalla
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../services/notification.service';

@Component({
  selector: 'app-toast-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div 
          class="toast show fade"
          [class.bg-success]="notification.type === 'success'"
          [class.bg-danger]="notification.type === 'error'"
          [class.bg-warning]="notification.type === 'warning'"
          [class.bg-info]="notification.type === 'info'"
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true">
          <div class="toast-header">
            <i [class]="getIcon(notification.type)" class="me-2"></i>
            <strong class="me-auto">{{ notification.title }}</strong>
            @if (notification.dismissible) {
              <button 
                type="button" 
                class="btn-close btn-close-white" 
                (click)="dismiss(notification.id)"
                aria-label="Cerrar">
              </button>
            }
          </div>
          <div class="toast-body text-white">
            {{ notification.message }}
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast {
      min-width: 300px;
      margin-bottom: 0.5rem;
    }

    .toast-header {
      background: rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
    }

    .toast.bg-success .toast-header i { color: #d1fae5; }
    .toast.bg-danger .toast-header i { color: #fecaca; }
    .toast.bg-warning .toast-header i { color: #fef3c7; }
    .toast.bg-info .toast-header i { color: #dbeafe; }
  `]
})
export class ToastNotificationsComponent {
  protected notificationService = inject(NotificationService);

  getIcon(type: Notification['type']): string {
    const icons: Record<Notification['type'], string> = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[type];
  }

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
