/**
 * Environment Configuration - Development
 * Sistema de Gestión de Socios - Colegio de Ingenieros Mecánicos de El Oro
 */

export const environment = {
  production: false,
  apiUrl: 'https://vinculacion-laravel.onrender.com/api',
  appName: 'Sistema de Gestión de Socios CIMO',
  version: '1.0.0',
  
  // Configuración de autenticación
  auth: {
    tokenKey: 'cimo_auth_token',
    userKey: 'cimo_user_data',
    tokenExpiryKey: 'cimo_token_expiry',
    refreshTokenBeforeExpiry: 5 * 60 * 1000, // 5 minutos antes
  },
  
  // Configuración de paginación
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50]
  },
  
  // Configuración de uploads
  uploads: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
    comprobantePath: '/storage/comprobantes/'
  }
};
