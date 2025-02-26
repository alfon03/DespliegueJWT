import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../../interfaces/auth';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

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
    const token = localStorage.getItem('token');
    if (token) {
      this._userId = this.decodeToken(token).userId;
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
            const token = response.token;
            this._userId = this.decodeToken(token).userId;
            localStorage.setItem('token', token);
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
    localStorage.removeItem('token');
    this._userId = '';
    this.isLoggedSignal.set(false);
    this.router.navigateByUrl('/login');
  }

  private decodeToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (error) {
      console.error('Error decodificando el token', error);
      return {};
    }
  }
}
