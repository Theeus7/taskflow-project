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
      font-family: 'Poppins', 'Roboto', 'Segoe UI', sans-serif;
    }
    
    h1 {
      color: #333;
      margin-bottom: 10px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    
    p {
      color: #666;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 400;
    }
    
    .dashboard-stats {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    
    .stat-card {
      border-radius: 8px;
      padding: 20px;
      min-width: 150px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }
    
    .stat-card:nth-child(1) {
      background: linear-gradient(135deg, #FFF3CD 0%, #FFE8A1 100%);
      color: #856404;
      border: 1px solid rgba(133, 100, 4, 0.2);
    }
    
    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #CCE5FF 0%, #B8DAFF 100%);
      color: #004085;
      border: 1px solid rgba(0, 64, 133, 0.2);
    }
    
    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #D4EDDA 0%, #C3E6CB 100%);
      color: #155724;
      border: 1px solid rgba(21, 87, 36, 0.2);
    }
    
    .stat-value {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 5px;
      letter-spacing: -0.5px;
    }
    
    .stat-label {
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
      border-radius: 8px;
      cursor: pointer;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    
    .btn-tasks {
      background: linear-gradient(135deg, #81c784 0%, #66bb6a 100%);
      color: #1b5e20;
      border: 1px solid rgba(21, 87, 36, 0.2);
    }
    
    .btn-tasks:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }
    
    .btn-logout {
      background: linear-gradient(135deg, #ef9a9a 0%, #e57373 100%);
      color: #b71c1c;
      border: 1px solid rgba(114, 28, 36, 0.2);
    }
    
    .btn-logout:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
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