import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  imports: [],
  templateUrl: './loading-screen.html',
  styleUrl: './loading-screen.css'
})
export class LoadingScreen implements OnInit {
  
  ngOnInit(): void {
    // Puedes ocultar el loader después de que termine la animación
    setTimeout(() => {
      // Oculta este componente o envía un evento para mostrar la web
    }, 200);
  }

}
