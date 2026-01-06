import { Routes } from '@angular/router';
import { ListadoSocios } from './socio/listado-socios/listado-socios';
import { Pagos } from './socio/pagos/pagos';
import { ReporteMensualidades } from './reportes/reporte-mensualidades/reporte-mensualidades';
import { ReporteSocios } from './reportes/reporte-socios/reporte-socios';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  {path: '', component: ListadoSocios},
  {path: 'socio', component: ListadoSocios},
  {path: 'pagos', component: Pagos},
  {path: 'reporte-mensualidades', component: ReporteMensualidades},
  {path: 'reporte-socios', component: ReporteSocios},
  {path: '**', redirectTo: ''},

  
  { 
    path: 'reporte-mensualidades', 
    component: ReporteMensualidades, 
    canActivate: [AuthGuard],
    data: { expectedRoles: ['presidente', 'tesorero'] } // Solo ellos
  },
  { 
    path: 'reporte-socios', 
    component: ReporteSocios, 
    canActivate: [AuthGuard],
    data: { expectedRoles: ['presidente', 'vicepresidente', 'vocal', 'socio'] }
  },
  { 
    path: 'pagos', 
    component: Pagos, 
    canActivate: [AuthGuard],
    data: { expectedRoles: ['presidente', 'vicepresidente', 'tesorero', 'vocal', 'socio', 'usuario'] } // Todos
  }

];
