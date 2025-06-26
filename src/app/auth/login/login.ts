import { Component, EventEmitter, Output } from '@angular/core';
import { Formulario } from '../formulario/formulario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Formulario],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  
@Output() eventoEnviar: EventEmitter<any> = new EventEmitter<any>();

@Output() cambiarFormulario = new EventEmitter<void>();

  ingresar(){

    this.eventoEnviar.emit(1);

  }

  registrar() {
    this.cambiarFormulario.emit();
  }

}

//viewchild - investigar esto