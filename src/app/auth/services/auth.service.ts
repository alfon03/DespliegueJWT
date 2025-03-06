import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { User, AuthResponse, Token } from '../../interfaces/auth';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

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
    let userId = localStorage.getItem('userId');
      if (userId) {
        this._userId = userId;
        this.isLoggedSignal.set(true);
    }
    this.validateToken().subscribe(resp=> console.log(resp))
  }

  get isLogged() {
    return this.isLoggedSignal.asReadonly();
  }
  validateToken(){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`) 
    // ESTO NO ES EQUIVALENTE YA QUE SET DEVUELVE UNA CABECERA NUEVA NO MODIFICA 
    // const header = new HttpHeaders()
    // header.set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`)
    return this.http.get<AuthResponse>(`${this.baseUrl}/verify`, {headers})
    .pipe(
      map( resp => {
        this.setUserSession(resp.token)
        return true;
      }),
      catchError( err => of(false))

    )
  }
  setUserSession(token: string){
    const decodeToken = this.decodeToken(token);
    if(decodeToken){
      this._userId = decodeToken.userId;
      localStorage.setItem('token', token);
      this.isLoggedSignal.set(true);

    }
  }
  login(email: string, password: string): Observable<AuthResponse> {
    console.log('Email: ', email, 'Password: ', password);
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap({
          next: (response) => {
            this.setUserSession(response.token)
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

  decodeToken(token: string): Token | null {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decodificando el token', error);
      return null;
    }
  }
}
