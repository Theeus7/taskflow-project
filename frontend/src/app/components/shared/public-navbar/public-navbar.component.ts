import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
      <div class="logo-container">
        <a routerLink="/" class="logo-text">TaskFlow</a>
        <span class="logo-subtitle logo-text">Fluxo Ideal, Tarefas em Ordem</span>
      </div>
    </div>

      <div class="navbar-center">
        <!-- Espaço para centralizar -->
      </div>
      
      <div class="navbar-actions">
        <a routerLink="/login" class="btn-login">Login</a>
        <a routerLink="/register" class="btn-register">Registrar</a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
      color: white;
      padding: 0 25px;
      height: 70px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
    }
    
    .navbar-brand a {
      color: white;
      font-size: 28px;
      font-weight: 600;
      text-decoration: none;
      letter-spacing: 0.5px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      font-family: var(--font-logo);
    }
    
    .navbar-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
    }
    
    .btn-login, .btn-register {
      padding: 8px 20px;
      border-radius: 6px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
    }

    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1;
    }

    .logo-text {
      color: white;
      font-size: 28px;
      font-weight: 600;
      text-decoration: none;
      letter-spacing: 0.5px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      font-family: var(--font-logo);
    }

    .logo-subtitle {
      font-size: 12px;
      font-weight: 400;
      color: white;
      opacity: 0.8;
      margin-top: 2px;
      margin-left: 60px;
    }


    .btn-login {
      background-color: transparent;
      border: 1px solid white;
      color: white;
    }
    
    .btn-login:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    
    .btn-register {
      background-color: white;
      color: var(--primary-dark);
    }
    
    .btn-register:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
      .navbar {
        padding: 0 15px;
      }
      
      .btn-login, .btn-register {
        padding: 6px 12px;
        font-size: 14px;
      }
      
      .navbar-brand a {
        font-size: 24px;
      }
    }
      
  `]
})
export class PublicNavbarComponent {}