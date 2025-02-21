import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ContactsService } from '../../services/contact.service';
import { Contact } from '../../../interfaces/contact';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-form.component.html',
})
export class AddFormComponent {
  contactForm!: FormGroup;
  userId!: string;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      contacts: this.fb.array([]),
    });
    this.userId = this.authService.userId;
  }

  get contacts(): FormArray {
    return this.contactForm.get('contacts') as FormArray;
  }

  createContact(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      direccion: ['', Validators.required],
    });
  }

  addContact(): void {
    this.contacts.push(this.createContact());
  }

  removeContact(index: number): void {
    this.contacts.removeAt(index);
  }

  saveContacts(): void {
    if (this.contactForm.invalid) {
      return;
    }

    const requests: Observable<Contact>[] = this.contacts.controls.map(
      (contactFormGroup) => {
        const contactData = {
          userId: this.userId,
          ...contactFormGroup.value,
        };
        return this.contactService.addContact(contactData);
      }
    );

    forkJoin(requests).subscribe({
      next: () => {
        Swal.fire({
          title: 'Guardado',
          text: 'Todos los contactos han sido guardados correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        this.contactForm.reset();
        this.contacts.clear();
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al guardar los contactos',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }
}
