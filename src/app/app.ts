import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from "./shared/components/menu/menu";
import { Encabezado } from "./shared/components/encabezado/encabezado";
import { Pie } from "./shared/components/pie/pie";
import { Login } from './auth/login/login';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Encabezado, Pie, Login, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'proyecto_vinculacion';
  logeado: number = 0;

  recibirLogin(valor: number){
    this.logeado=valor;
  }
}

