import { Component } from '@angular/core';
import { FormularioSocios } from '../formulario-socios/formulario-socios';

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
