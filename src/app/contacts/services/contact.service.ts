import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Observable, tap } from 'rxjs';
import { Contact } from '../../interfaces/contact';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private http: HttpClient = inject(HttpClient);
  private authService: AuthService = inject(AuthService);
  private urlBase: string = 'http://localhost:3000/api/contactos';

  private contactsSignal = signal<Contact[]>([]);

  constructor() {
    this.updateUserId();
  }

  get contacts() {
    return this.contactsSignal;
  }

  private updateUserId(): void {
    if (this.authService.isLogged()) {
      const userId = this.authService.userId;
    }
  }

  getContacts(): void {
    this.updateUserId();
    const userId = this.authService.userId;

    if (!userId) return;

    this.http.get<Contact[]>(`${this.urlBase}/${userId}`).subscribe({
      next: (contacts) => this.contactsSignal.set(contacts),
      error: (error) => console.error('Error al obtener contactos:', error),
    });
  }

  addContact(contact: Omit<Contact, 'id'>): Observable<Contact> {
    return this.http
      .post<Contact>(`${this.urlBase}`, contact)
      .pipe(
        tap((newContact) =>
          this.contactsSignal.set([...this.contacts(), newContact])
        )
      );
  }

  removeContact(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.urlBase}/${id}`)
      .pipe(
        tap(() =>
          this.contactsSignal.set(
            this.contacts().filter((contact) => contact.id !== id)
          )
        )
      );
  }

  getContactById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.urlBase}/${id}`);
  }

  updateContact(id: string, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.urlBase}/${id}`, contact);
  }

  clearContacts(): void {
    this.contactsSignal.set([]);
  }
}
