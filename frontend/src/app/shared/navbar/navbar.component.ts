import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="isLoggedIn">
      <div class="navbar-brand">
        <a routerLink="/dashboard">TaskFlow</a>
      </div>
      
      <div class="navbar-menu">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/tasks" routerLinkActive="active">Tarefas</a>
      </div>
      
      <div class="navbar-user">
        <div class="dropdown">
          <button class="dropbtn">
            <i class="fas fa-user"></i> {{ username }}
            <i class="fas fa-caret-down"></i>
          </button>
          <div class="dropdown-content">
            <a routerLink="/dashboard">Perfil</a>
            <a href="#" (click)="logout($event)">Sair</a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #333;
      color: white;
      padding: 0 20px;
      height: 60px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .navbar-brand a {
      color: white;
      font-size: 20px;
      font-weight: bold;
      text-decoration: none;
    }
    
    .navbar-menu {
      display: flex;
      gap: 20px;
    }
    
    .navbar-menu a {
      color: #ddd;
      text-decoration: none;
      padding: 5px 10px;
      border-radius: 4px;
      transition: all 0.3s;
    }
    
    .navbar-menu a:hover, .navbar-menu a.active {
      color: white;
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .navbar-user {
      position: relative;
    }
    
    .dropdown {
      position: relative;
      display: inline-block;
    }
    
    .dropbtn {
      background-color: transparent;
      color: white;
      padding: 10px;
      font-size: 16px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .dropdown-content {
      display: none;
      position: absolute;
      right: 0;
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .dropdown-content a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      transition: background-color 0.3s;
    }
    
    .dropdown-content a:hover {
      background-color: #f1f1f1;
    }
    
    .dropdown:hover .dropdown-content {
      display: block;
    }
    
    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        height: auto;
        padding: 10px;
      }
      
      .navbar-brand, .navbar-menu, .navbar-user {
        width: 100%;
        margin: 5px 0;
        text-align: center;
      }
      
      .navbar-menu {
        flex-direction: column;
        gap: 5px;
      }
      
      .dropdown {
        width: 100%;
      }
      
      .dropdown-content {
        width: 100%;
        position: relative;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to the auth service's currentUser$ observable
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user?.username || '';
    });
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}