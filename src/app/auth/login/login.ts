import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

usuario: string = '';
password: string = '';
  
@Output() eventoEnviar: EventEmitter<any> = new EventEmitter<any>();

@Output() cambiarFormulario = new EventEmitter<void>();

  ingresar(){
    this.eventoEnviar.emit(1);
  }

  registrar() {
    this.cambiarFormulario.emit();
  }

  getRole(): string | null {
    return localStorage.getItem('presidente, vicepresidente, socio, usuario'); // O la lógica que uses
  }

  isLoggedIn(): boolean {
    return !!this.getRole();
  }

}
