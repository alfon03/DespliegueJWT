import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const loginGuard: CanMatchFn = (route, segments) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const isLogged = authService.isLogged();
  
  if (!isLogged) {
    Swal.fire({
      title: 'Error: Usuario no logueado',
      text: 'Redirigiendo a Login',
      icon: 'warning',
    }).then(() => {
      router.navigate(['/login']);
    });
  }

  return isLogged;
};
