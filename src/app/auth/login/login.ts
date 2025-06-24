import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  
@Output() eventoEnviar: EventEmitter<any> = new EventEmitter<any>();

  ingresar(){

    this.eventoEnviar.emit(1);

  }
}

//viewchild - investigar esto