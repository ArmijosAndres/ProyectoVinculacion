import { Component } from '@angular/core';

@Component({
  selector: 'app-encabezado',
  imports: [],
  templateUrl: './encabezado.html',
  styleUrl: './encabezado.css'
})
export class Encabezado {

ngOnInit(): void {
  const toggleBtn = document.getElementById('toggleSidenav');
  const sidenav = document.getElementById('sidenav-main');
  const body = document.body;
  const pinClass = 'g-sidenav-pinned';

  // Mostrar/ocultar con el botón hamburguesa
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      body.classList.toggle(pinClass);
    });
  }

  // Cerrar automáticamente al hacer clic en cualquier enlace del menú
  const navLinks = document.querySelectorAll('#sidenav-main .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1200) {
        body.classList.remove(pinClass);
      }
    });
  });
}

}
