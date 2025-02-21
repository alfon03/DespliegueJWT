import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../../interfaces/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = 'http://localhost:3000/api/auth';
  private _userId: string = '';
  private isLoggedSignal = signal<boolean>(false);
  private router: Router = inject(Router);

  constructor() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this._userId = userId;
      this.isLoggedSignal.set(true);
    }
  }

  get isLogged() {
    return this.isLoggedSignal.asReadonly();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    console.log('Email: ', email, 'Password: ', password);
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap({
          next: (response) => {
            this._userId = response.userId;
            localStorage.setItem('userId', response.userId);
            this.isLoggedSignal.set(true);
          },
        })
      );
  }

  get userId() {
    return this._userId;
  }

  register(userData: User): Observable<AuthResponse> {
    console.log(userData);
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, userData);
  }

  logOut() {
    localStorage.removeItem('userId');
    this._userId = '';
    this.isLoggedSignal.set(false);
    this.router.navigateByUrl('/login');
  }
}
