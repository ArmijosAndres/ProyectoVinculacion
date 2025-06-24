import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-formulario',
  imports: [],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class Formulario {

  @Output() eventoEnviar: EventEmitter<any> = new EventEmitter<any>();

  registrar(){

    this.eventoEnviar.emit(0);

  }

  ingresar(){

    this.eventoEnviar.emit(1);

  }

}
