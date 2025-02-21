import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import Swal from 'sweetalert2';
import { ContactsService } from '../../services/contact.service';
import { Contact } from '../../../interfaces/contact';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './edit-form.component.html',
})
export class EditFormComponent {
  editForm: FormGroup;
  contactId: string;
  contact: Contact | undefined;
  emailErrorMsg: string = '';

  private contactsService: ContactsService = inject(ContactsService);
  private fb: FormBuilder = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  constructor() {
    this.contactId = this.route.snapshot.paramMap.get('id') ?? '';
    this.editForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadContact();
  }

  loadContact(): void {
    this.contactsService.getContactById(this.contactId).subscribe((contact) => {
      this.contact = contact;
      this.editForm.patchValue(contact);
    });
  }

  getEmailErrorMsg(): string {
    const emailControl = this.editForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'El correo electrónico es obligatorio.';
    }
    if (emailControl?.hasError('email')) {
      return 'El correo electrónico no es válido.';
    }
    return '';
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedContact = this.editForm.value;
      this.contactsService
        .updateContact(this.contactId, updatedContact)
        .subscribe({
          next: () => {
            Swal.fire({
              title: 'Actualizado',
              text: 'El contacto ha sido actualizado con éxito',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
            this.router.navigate(['/contacts']);
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un error al actualizar el contacto',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
    }
  }
}
