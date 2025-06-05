import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { User, UserCredentials, UserRegistration, UserProfileUpdate } from '../models/user.model';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/v1/users';
  private platformId = inject(PLATFORM_ID);
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  
  // Observable público para componentes se inscreverem
  public authStatus$ = this.authStatusSubject.asObservable();
  
  constructor(private http: HttpClient) {
    // Inicializa o status de autenticação
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = !!localStorage.getItem('currentUser');
      this.authStatusSubject.next(isLoggedIn);
    }
  }
  
  register(user: UserRegistration): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }
  
  login(credentials: UserCredentials): Observable<User> {
    // Primeiro, garantir que qualquer sessão anterior seja removida
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      this.authStatusSubject.next(false);
    }
    
    return this.http.post<User>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(user => {
          // Armazenar o usuário no localStorage apenas no navegador
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            // Atualiza o status de autenticação
            this.authStatusSubject.next(true);
          }
        })
      );
  }
  
  logout(): void {
    // Remover o usuário do localStorage apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      // Atualiza o status de autenticação
      this.authStatusSubject.next(false);
    }
  }
  
  isLoggedIn(): boolean {
    // Verificar se há um usuário no localStorage apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('currentUser');
    }
    return false;
  }
  
  getCurrentUser(): User | null {
    // Obter o usuário do localStorage apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('currentUser');
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }
  
  updateProfile(profileUpdate: UserProfileUpdate): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, profileUpdate)
      .pipe(
        tap(updatedUser => {
          // Atualizar o usuário no localStorage
          this.updateCurrentUser(updatedUser);
        })
      );
  }
  
  updateCurrentUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }
  
  // Métodos para administração de usuários
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }
  
  createUser(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admin/users`, userData);
  }
  
  createAdmin(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }
  
  updateUser(userId: number, userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/admin/users/${userId}`, userData);
  }
  
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}`);
  }
}