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
  private userId: string = '';
  
  private contactsSignal = signal<Contact[]>([]);

  constructor() {
    if (this.authService.isLogged()) {
      this.userId = this.authService.userId;
    }
  }

  get contacts() {
    return this.contactsSignal;
  }

  

  getContacts(): void{
    console.log('getcontacts')
    const token = localStorage.getItem('token') || '';
    // const headers: HttpHeaders = new HttpHeaders()
    // .set('Authorization', `Bearer ${token}`);
    this.userId = this.authService.userId;
    if (this.userId) {
      this.http.get<Contact[]>(`${this.urlBase}/${this.userId}`)
      // this.http.get<Contact[]>(`${this.urlBase}/${this.userId}`, {headers})
      .subscribe({
        next: contacts => {
          console.log('Contacts: ',contacts)
          this.contactsSignal.set(contacts)
        },
        error: error => console.log('Error: ', error)
      })
    }
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
