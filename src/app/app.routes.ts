import { Routes } from '@angular/router';
import { ListadoSocios } from './socio/listado-socios/listado-socios';
import { Pagos } from './socio/pagos/pagos';
import { ReporteMensualidades } from './reportes/reporte-mensualidades/reporte-mensualidades';
import { ReporteSocios } from './reportes/reporte-socios/reporte-socios';

export const routes: Routes = [
  {path: '', component: ListadoSocios},
  {path: 'socio', component: ListadoSocios},
  {path: 'pagos', component: Pagos},
  {path: 'reporte-mensualidades', component: ReporteMensualidades},
  {path: 'reporte-socios', component: ReporteSocios},
  {path: '**', redirectTo: ''}
];
