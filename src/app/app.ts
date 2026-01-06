import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from "./shared/components/menu/menu";
import { Encabezado } from "./shared/components/encabezado/encabezado";
import { Pie } from "./shared/components/pie/pie";
import { Login } from './auth/login/login';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Formulario } from './auth/formulario/formulario';
import { LoadingScreen } from "./loading-screen/loading-screen";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Menu, Encabezado, Pie, Login, FormsModule, CommonModule, Formulario, LoadingScreen],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'proyecto_vinculacion';
  logeado: number = 0;
  formularioActual: 'login' | 'registro' = 'login';

  recibirLogin(valor: number){
    this.logeado=valor;
  }

  recibirRegistro(valor: number){
    this.logeado=valor;
  }

  isLoading: boolean = true; // Empieza en true

  ngOnInit() {
    // Simulamos la carga inicial (o esperamos a la respuesta de una API)
    setTimeout(() => {
      this.isLoading = false;
    }, 2400);
  }

}

