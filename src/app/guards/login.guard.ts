import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';

export const loginGuard: CanMatchFn = (route, segments) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  

  return authService.validateToken()
  .pipe(
    tap(isLogged => {
      if(!isLogged){

      
      Swal.fire({
        title: 'Error: Usuario no logueado',
        text: 'Redirigiendo a Login',
        icon: 'warning',
      }).then(() => {
        router.navigate(['/login']);
      });   
    }
    })
  )

};
