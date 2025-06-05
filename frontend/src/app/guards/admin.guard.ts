import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.authService.getCurrentUser();
    
    // Verifica se o usuário está logado e tem o papel de administrador
    if (currentUser && currentUser.role === 'admin') {
      return true;
    }
    
    // Redireciona para o dashboard se não for administrador
    return this.router.createUrlTree(['/dashboard']);
  }
}