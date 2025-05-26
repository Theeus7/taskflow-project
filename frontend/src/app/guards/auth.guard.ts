import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private platformId = inject(PLATFORM_ID);
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    // No servidor, permitir acesso para evitar erros de SSR
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}