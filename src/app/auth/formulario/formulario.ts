import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [],
  templateUrl: './formulario.html',
  styleUrls: ['./formulario.css']
})
export class Formulario {

  @Output() eventoEnviar = new EventEmitter<number>(); // para loguear (logeado = 1)

  ingresar() {
    this.eventoEnviar.emit(1); // el padre pone logeado = 1, carga la app
  }

}
