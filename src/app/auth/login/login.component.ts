import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  passwordVisible: boolean = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
      ],
    ],
  });

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        Swal.fire({
          title: 'Login correcto',
          text: 'Has iniciado sesión',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => this.router.navigateByUrl('/contacts'));
      },
      error: () => {
        Swal.fire({
          title: 'Error!',
          text: 'Credenciales incorrectas',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  campoNoValido(campo: string): boolean {
    const field = this.loginForm.get(campo);
    return field?.invalid ?? (false && field?.touched) ?? false;
  }
}
