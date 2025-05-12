import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <p>Bem-vindo, {{ username }}!</p>
      
      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-value">{{ taskStats.pendentes }}</div>
          <div class="stat-label">Tarefas Pendentes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ taskStats.emAndamento }}</div>
          <div class="stat-label">Em Andamento</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ taskStats.concluidas }}</div>
          <div class="stat-label">Concluídas</div>
        </div>
      </div>
      
      <div class="dashboard-actions">
        <button class="btn-tasks" routerLink="/tasks">
          <i class="fas fa-tasks"></i> Ver Minhas Tarefas
        </button>
        <button class="btn-logout" (click)="logout()">
          <i class="fas fa-sign-out-alt"></i> Sair
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    
    h1 {
      color: #333;
      margin-bottom: 10px;
    }
    
    p {
      color: #666;
      margin-bottom: 20px;
      font-size: 18px;
    }
    
    .dashboard-stats {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    
    .stat-card {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      min-width: 150px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
    }
    
    .stat-card:nth-child(1) {
      border-top: 4px solid #FFC107; /* Amarelo para pendentes */
    }
    
    .stat-card:nth-child(2) {
      border-top: 4px solid #2196F3; /* Azul para em andamento */
    }
    
    .stat-card:nth-child(3) {
      border-top: 4px solid #4CAF50; /* Verde para concluídas */
    }
    
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .stat-label {
      color: #666;
      font-size: 14px;
    }
    
    .dashboard-actions {
      display: flex;
      flex-direction: column;
      gap: 15px;
      max-width: 300px;
      margin: 0 auto;
    }
    
    button {
      padding: 12px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: background-color 0.3s;
    }
    
    .btn-tasks {
      background-color: #4CAF50;
      color: white;
    }
    
    .btn-tasks:hover {
      background-color: #45a049;
    }
    
    .btn-logout {
      background-color: #f44336;
      color: white;
    }
    
    .btn-logout:hover {
      background-color: #d32f2f;
    }
    
    @media (max-width: 600px) {
      .dashboard-stats {
        flex-direction: column;
        align-items: center;
      }
      
      .stat-card {
        width: 100%;
        max-width: 250px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  username: string = '';
  taskStats = {
    pendentes: 0,
    emAndamento: 0,
    concluidas: 0
  };

  constructor(
    private authService: AuthService, 
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.username;
      this.loadTaskStats();
    }
  }

  loadTaskStats(): void {
    // Carregar tarefas pendentes
    this.taskService.getTasks('pendente').subscribe(tasks => {
      this.taskStats.pendentes = tasks.length;
    });

    // Carregar tarefas em andamento
    this.taskService.getTasks('em_andamento').subscribe(tasks => {
      this.taskStats.emAndamento = tasks.length;
    });

    // Carregar tarefas concluídas
    this.taskService.getTasks('concluida').subscribe(tasks => {
      this.taskStats.concluidas = tasks.length;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}