/**
 * Notification Service - Sistema de Notificaciones
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Maneja notificaciones toast y alertas del sistema
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  private readonly DEFAULT_DURATION = 5000; // 5 segundos
  private readonly ERROR_DURATION = 8000;   // 8 segundos para errores

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, title?: string, duration?: number): void {
    this.show({
      type: 'success',
      message,
      title: title || 'Éxito',
      duration: duration || this.DEFAULT_DURATION
    });
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, title?: string, duration?: number): void {
    this.show({
      type: 'error',
      message,
      title: title || 'Error',
      duration: duration || this.ERROR_DURATION
    });
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, title?: string, duration?: number): void {
    this.show({
      type: 'warning',
      message,
      title: title || 'Advertencia',
      duration: duration || this.DEFAULT_DURATION
    });
  }

  /**
   * Muestra una notificación informativa
   */
  info(message: string, title?: string, duration?: number): void {
    this.show({
      type: 'info',
      message,
      title: title || 'Información',
      duration: duration || this.DEFAULT_DURATION
    });
  }

  /**
   * Muestra una notificación personalizada
   */
  show(notification: Omit<Notification, 'id'>): void {
    const id = this.generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      dismissible: notification.dismissible ?? true
    };

    this._notifications.update(notifications => [...notifications, newNotification]);

    // Auto-dismiss después de la duración especificada
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => this.dismiss(id), newNotification.duration);
    }
  }

  /**
   * Cierra una notificación específica
   */
  dismiss(id: string): void {
    this._notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }

  /**
   * Cierra todas las notificaciones
   */
  dismissAll(): void {
    this._notifications.set([]);
  }

  /**
   * Genera un ID único para la notificación
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
