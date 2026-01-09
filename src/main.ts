/**
 * Main Bootstrap File
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 * 
 * Punto de entrada de la aplicación Angular
 * 
 * @author Andrés Armijos
 * @version 1.0.0
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Error al iniciar la aplicación:', err));
