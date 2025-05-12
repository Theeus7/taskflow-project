import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface UserLogin {
  email: string;
  password: string;
}

interface UserRegister {
  username: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/v1/users';
  
  constructor(private http: HttpClient) { }
  
  login(email: string, password: string): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(user => {
          // Armazenar informações do usuário no localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
        })
      );
  }
  
  register(user: UserRegister): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, user);
  }
  
  logout(): void {
    localStorage.removeItem('currentUser');
  }
  
  getCurrentUser(): UserResponse | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}