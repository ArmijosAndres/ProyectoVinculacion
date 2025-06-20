import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from "./shared/components/menu/menu";
import { Encabezado } from "./shared/components/encabezado/encabezado";
import { Pie } from "./shared/components/pie/pie";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Encabezado, Pie],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'proyecto_vinculacion';
}

