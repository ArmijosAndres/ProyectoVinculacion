import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { LoginService } from '../auth/services/login-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    // 1. Verificar si el usuario está logueado
    if (!this.loginService.isLoggedIn()) {
      return this.router.createUrlTree(['/login']);
    }

    // 2. Obtener los roles permitidos para esta ruta específica
    // El array 'expectedRoles' se define en el archivo de rutas
    const expectedRoles = route.data['expectedRoles'] as string[];
    const userRole = this.loginService.getRole();

    // 3. Verificar si el rol del usuario está en la lista de permitidos
    if (expectedRoles && !expectedRoles.includes(userRole!)) {
      // Si el rol no coincide, redirigir a una página de acceso denegado o inicio
      return this.router.createUrlTree(['/unauthorized']);
    }

    return true;
  }
}
