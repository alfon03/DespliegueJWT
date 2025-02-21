import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ValidateEmailService } from '../services/validateEmail.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private emailValidatorService = inject(ValidateEmailService);
  passwordVisible: boolean = false;
  confirmPasswordVisible = false;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  registerForm: FormGroup = this.fb.group(
    {
      nombre: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailValidatorService],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.passwordValidator(),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.equalFields('password', 'confirmPassword') }
  );

  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      return hasLetter && hasNumber ? null : { passwordInvalid: true };
    };
  }

  private equalFields(field1: string, field2: string): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const control1 = form.get(field1);
      const control2 = form.get(field2);

      if (control1?.value !== control2?.value) {
        control2?.setErrors({ nonEquals: true });
        return { nonEquals: true };
      }

      control2?.setErrors(null);
      return null;
    };
  }

  get emailErrorMsg(): string {
    const errors = this.registerForm.get('email')?.errors;
    if (!errors) return '';
    if (errors['required']) return 'El email es obligatorio';
    if (errors['email']) return 'El email no tiene formato de correo';
    if (errors['emailTaken']) return 'El email ya está en uso';
    return '';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { nombre, email, password } = this.registerForm.value;

      this.authService.register({ name: nombre, email, password }).subscribe({
        next: () => {
          Swal.fire({
            title: 'Registro exitoso',
            text: 'Te has registrado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => this.router.navigate(['/login']));
        },
        error: (error) => {
          Swal.fire({
            title: 'Error en el registro',
            text: error?.error?.message || 'Error desconocido',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
          console.log(error);
        },
      });
    }
  }
}
