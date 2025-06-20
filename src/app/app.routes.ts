import { Routes } from '@angular/router';
import { ListadoSocios } from './socio/listado-socios/listado-socios';
//import { FormularioSocios } from './socio/formulario-socios/formulario-socios';//
// Update the path below if the actual location is different
import { ReporteMensualidades } from './reporte/reporte-mensualidades/reporte-mensualidades';
import { ReporteSocios } from './reporte/reporte-socios/reporte-socios';
import { Login } from './auth/login/login';

export const routes: Routes = [
    {path: '', component: Login},
  {path: 'socio', component: ListadoSocios},
  {path: 'reporte-mensualidades', component: ReporteMensualidades},
  {path: 'reporte-socios', component: ReporteSocios},
  {path: '**', redirectTo: ''}
];
