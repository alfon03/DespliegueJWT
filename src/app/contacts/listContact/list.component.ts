import { Component, inject, OnInit } from '@angular/core';
import { ContactsService } from '../services/contact.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AddFormComponent } from '../forms/addForm/add-form.component';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ReactiveFormsModule, AddFormComponent],
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  contactsService: ContactsService = inject(ContactsService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.contactsService.getContacts();
  }

  removeContact(id: string) {
    Swal.fire({
      title: 'Confirmación borrado',
      text: '¿Estás seguro de que quieres eliminar el registro seleccionado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactsService.removeContact(id).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Eliminado',
              text: 'El contacto ha sido eliminado con éxito',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
          },
        });
      }
    });
  }

  editContact(id: string) {
    this.router.navigate([`contact/edit/${id}`]);
  }
}
