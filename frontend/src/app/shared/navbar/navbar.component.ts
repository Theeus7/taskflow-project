import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="isLoggedIn">
      <div class="navbar-brand">
        <div class="logo-container">
          <a routerLink="/dashboard" class="logo-text">TaskFlow</a>
          <span class="logo-subtitle logo-text">Fluxo Ideal, Tarefas em Ordem</span>
        </div>
      </div>
      
      <div class="navbar-menu">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/tasks" routerLinkActive="active">Tarefas</a>
      </div>
      
      <div class="navbar-user">
        <div class="dropdown" (mouseenter)="showDropdown()" (mouseleave)="hideDropdownWithDelay()">
          <button class="dropbtn">
            <i class="fas fa-user"></i> {{ username }}
            <i class="fas fa-caret-down"></i>
          </button>
          <div class="dropdown-content" [class.show]="isDropdownVisible">
            <a routerLink="/dashboard">Perfil</a>
            <a href="#" (click)="logout($event)">Sair</a>
          </div>
        </div>
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
      position: relative;
      z-index: 100;
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
    
    .navbar-menu {
      display: flex;
      justify-content: center;
      gap: 25px;
    }
    
    .navbar-menu a {
      color: var(--text-light);
      text-decoration: none;
      padding: 8px 15px;
      border-radius: var(--border-radius);
      transition: all 0.3s;
      font-weight: 500;
    }
    
    .navbar-menu a:hover, .navbar-menu a.active {
      color: white;
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }
    
    .navbar-user {
      display: flex;
      justify-content: flex-end;
      position: relative;
    }
    
    .dropdown {
      position: relative;
      display: inline-block;
    }
    
    .dropbtn {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      padding: 10px 15px;
      font-size: 16px;
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: var(--transition);
    }
    
    .dropbtn:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .dropdown-content {
      display: none;
      position: absolute;
      right: 0;
      background-color: var(--white);
      min-width: 180px;
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      border-radius: var(--border-radius);
      overflow: hidden;
      margin-top: 5px;
    }
    
    .dropdown-content a {
      color: var(--text-color);
      padding: 14px 18px;
      text-decoration: none;
      display: block;
      transition: var(--transition);
      font-weight: 500;
    }
    
    .dropdown-content a:hover {
      background-color: var(--gray-light);
      color: var(--primary-color);
    }
    
    .dropdown-content.show {
      display: block;
    }
    
    @media (max-width: 768px) {
      .navbar {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        padding: 15px;
        height: auto;
      }
      
      .navbar-brand, .navbar-menu, .navbar-user {
        width: 100%;
        margin: 8px 0;
        text-align: center;
      }
      
      .navbar-menu {
        flex-direction: column;
        gap: 10px;
      }
      
      .navbar-menu a {
        padding: 10px;
      }
      
      .navbar-user {
        justify-content: center;
      }
      
      .dropdown {
        width: 100%;
      }
      
      .dropbtn {
        width: 100%;
        justify-content: center;
      }
      
      .dropdown-content {
        width: 100%;
        position: relative;
      }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  username: string = '';
  isDropdownVisible: boolean = false;
  private dropdownTimeout: any;
  private authSubscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Inicializa o estado com o valor atual
    this.isLoggedIn = this.authService.isLoggedIn();
    const user = this.authService.getCurrentUser();
    this.username = user?.username || '';
    
    // Inscreve-se para receber atualizações de status de autenticação
    this.authSubscription = this.authService.authStatus$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        const user = this.authService.getCurrentUser();
        this.username = user?.username || '';
      }
    });
  }

  ngOnDestroy(): void {
    // Cancela a inscrição para evitar vazamentos de memória
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  showDropdown(): void {
    // Cancelar qualquer timeout pendente
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
      this.dropdownTimeout = null;
    }
    this.isDropdownVisible = true;
  }

  hideDropdownWithDelay(): void {
    // Configurar um timeout para esconder o dropdown após um atraso
    this.dropdownTimeout = setTimeout(() => {
      this.isDropdownVisible = false;
    }, 500); // 500ms de atraso antes de fechar
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}