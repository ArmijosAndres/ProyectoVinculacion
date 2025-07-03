import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartType, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-reporte-socios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte-socios.html',
  styleUrls: ['./reporte-socios.css']
})
export class ReporteSocios {

  socios = [
    { nombre: 'Gabriel Encalada', tipo: 'Titular', ingreso: '2022-01-15', estado: 'Activo' },
    { nombre: 'Cristian Arias', tipo: 'Afiliado', ingreso: '2023-05-22', estado: 'Pendiente' },
    { nombre: 'Bryan Vasquez', tipo: 'Titular', ingreso: '2021-09-10', estado: 'Inactivo' },
    { nombre: 'María León', tipo: 'Honorario', ingreso: '2020-11-04', estado: 'Activo' },
    { nombre: 'Ana Cabrera', tipo: 'Afiliado', ingreso: '2024-02-28', estado: 'Pendiente' }
  ];

  chartLabels: string[] = ['Activo', 'Pendiente', 'Inactivo'];
  chartType: ChartType = 'pie';
  chartData: ChartConfiguration<'pie'>['data'] = {
    labels: this.chartLabels,
    datasets: [
      {
        data: [2, 2, 1],
        backgroundColor: ['#198754', '#ffc107', '#dc3545']
      }
    ]
  };

}

// en tabla poner por evento de onclick para que se refleje un diagrama de los estados