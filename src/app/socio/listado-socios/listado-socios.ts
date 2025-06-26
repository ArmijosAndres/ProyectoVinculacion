import { Component } from '@angular/core';
import { FormularioSocios } from '../formulario-socios/formulario-socios';
declare var $:any;

@Component({
  selector: 'app-listado-socios',
  imports: [FormularioSocios],
  templateUrl: './listado-socios.html',
  styleUrl: './listado-socios.css'
})
export class ListadoSocios {
   agregar(): void
  {
    $("#modalformulariosocio").modal("show");
  }
}

//trabajar con un data table al hacer la funcion de busqueda en la tabla y al hacerlo con la API
//https://datatables.net/manual/tech-notes/7