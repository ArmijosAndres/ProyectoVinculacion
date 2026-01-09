/**
 * Servicio de Autenticación
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Maneja autenticación JWT, gestión de sesión y permisos de usuario
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RoleName,
  hasPermission,
  isDirectiva, 
  UserStatus
} from '../models/user.model';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'cimo_auth_token';
const USER_KEY = 'cimo_user_data';
const TOKEN_EXPIRY_KEY = 'cimo_token_expiry';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  
  // State management con signals (Angular 17+)
  private _isLoading = signal<boolean>(false);
  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _authError = signal<string | null>(null);

  // Public readonly signals
  readonly isLoading = this._isLoading.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly authError = this._authError.asReadonly();

  // Computed signals
  readonly userRole = computed(() => this._currentUser()?.rol?.nombre_rol ?? null);
  readonly isDirectiva = computed(() => {
    const role = this.userRole();
    return role ? isDirectiva(role) : false;
  });
  readonly userName = computed(() => {
    const user = this._currentUser();
    return user ? `${user.nombres} ${user.apellidos}` : '';
  });

  // BehaviorSubject para compatibilidad con código existente
  private authStateSubject = new BehaviorSubject<boolean>(false);
  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuthState();
  }

  /**
   * Inicializa el estado de autenticación desde localStorage
   */
  private initializeAuthState(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && user && !this.isTokenExpired()) {
      this._currentUser.set(user);
      this._isAuthenticated.set(true);
      this.authStateSubject.next(true);
    } else {
      this.clearAuthData();
    }
  }

/**
   * Inicia sesión con credenciales
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this._isLoading.set(true);
    this._authError.set(null);

    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        // Mapear respuesta del backend al formato esperado por el frontend
        if (response.success && response.token && response.user) {
          const mappedUser: User = {
            id_usuario: response.user.id,
            id_rol: 0,
            cedula: response.user.cedula,
            nombres: response.user.nombre || response.user.nombres || '',
            apellidos: response.user.apellidos || '',
            email: response.user.email,
            estado: 'activo' as UserStatus,
            fecha_registro: new Date(),
            rol: {
              id_rol: 0,
              nombre_rol: response.user.role as RoleName
            }
          };
          
          return {
            success: true,
            message: response.message,
            token: response.token,
            user: mappedUser
          } as LoginResponse;
        }
        return response;
      }),
      tap(response => {
        if (response.success && response.token && response.user) {
          this.setAuthData(response.token, response.user);
        }
      }),
      catchError(error => this.handleAuthError(error)),
      finalize(() => this._isLoading.set(false))
    );
  }

  /**
   * Registra un nuevo usuario (solicitud de registro)
   */
  register(data: RegisterRequest): Observable<{ success: boolean; message: string }> {
    this._isLoading.set(true);
    this._authError.set(null);

    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/register`, 
      data
    ).pipe(
      catchError(error => this.handleAuthError(error)),
      finalize(() => this._isLoading.set(false))
    );
  }

  /**
   * Cierra sesión
   */
  logout(): Observable<any> {
    const token = this.getToken();
    
    if (token) {
      return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
        tap(() => this.clearAuthData()),
        catchError(() => {
          this.clearAuthData();
          return of({ success: true });
        }),
        finalize(() => this.router.navigate(['/login']))
      );
    }
    
    this.clearAuthData();
    this.router.navigate(['/login']);
    return of({ success: true });
  }

  /**
   * Refresca el token de autenticación
   */
  refreshToken(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh`, {}).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
        }
      }),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene el perfil del usuario actual
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap(user => {
        this._currentUser.set(user);
        this.setStoredUser(user);
      })
    );
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  hasPermission(permission: string): boolean {
    const role = this.userRole();
    return role ? hasPermission(role, permission) : false;
  }

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles: RoleName[]): boolean {
    const userRole = this.userRole();
    return userRole ? roles.includes(userRole) : false;
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Verifica si hay un usuario autenticado
   */
  isLoggedIn(): boolean {
    return this._isAuthenticated() && !this.isTokenExpired();
  }

  /**
   * Obtiene el rol del usuario actual
   */
  getRole(): RoleName | null {
    return this.userRole();
  }

  // ============== Métodos privados ==============

  private setAuthData(token: string, user: User): void {
    this.setToken(token);
    this.setStoredUser(user);
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
    this.authStateSubject.next(true);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    // Calcular expiración (asumiendo token válido por 24 horas)
    const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
  }

  private setStoredUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData) as User;
      } catch {
        return null;
      }
    }
    return null;
  }

  private isTokenExpired(): boolean {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    return new Date().getTime() > parseInt(expiry, 10);
  }

  private clearAuthData(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this.authStateSubject.next(false);
  }

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    let message = 'Error de autenticación';
    
    if (error.status === 401) {
      message = 'Credenciales inválidas';
    } else if (error.status === 422) {
      message = error.error?.message || 'Datos de entrada inválidos';
    } else if (error.status === 0) {
      message = 'No se pudo conectar con el servidor';
    } else if (error.error?.message) {
      message = error.error.message;
    }

    this._authError.set(message);
    return throwError(() => new Error(message));
  }
}
