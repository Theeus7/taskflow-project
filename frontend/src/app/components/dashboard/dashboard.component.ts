import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

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
          <div class="stat-label">A Fazer</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ taskStats.emAndamento }}</div>
          <div class="stat-label">Em<br>Andamento</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ taskStats.concluidas }}</div>
          <div class="stat-label">Concluídas</div>
        </div>
      </div>
      
      <!-- Gráfico removido conforme solicitado -->
      
      <div class="dashboard-actions">
        <button class="btn-tasks" routerLink="/tasks">
          <i class="fas fa-tasks"></i> Ver Minhas Tarefas
        </button>
        <button class="btn-profile" routerLink="/profile">
          <i class="fas fa-user"></i> Meu Perfil
        </button>
        <button class="btn-admin" *ngIf="isAdmin" routerLink="/admin">
          <i class="fas fa-users-cog"></i> Painel Admin
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
    
    .pie-chart-container {
      width: 100%;
      max-width: 400px;
      margin: 0 auto 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .pie-chart {
      position: relative;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: #f0f0f0;
      overflow: hidden;
      margin-bottom: 20px;
    }
    
    .pie-slice {
      position: absolute;
      width: 100%;
      height: 100%;
      transform-origin: 50% 50%;
      transition: all 0.3s;
    }
    
    .pie-slice {
      position: absolute;
      width: 100%;
      height: 100%;
      clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%);
      transform-origin: center;
    }
    
    .pie-slice.pendente {
      background: #FFE8A1;
      clip-path: polygon(
        50% 50%,
        50% 0%,
        calc(50% + 50% * cos(calc(var(--percentage) * 3.6deg))) calc(50% - 50% * sin(calc(var(--percentage) * 3.6deg)))
      );
      transform: rotate(0deg);
      z-index: 3;
    }
    
    .pie-slice.em-andamento {
      background: #B8DAFF;
      clip-path: polygon(
        50% 50%,
        50% 0%,
        calc(50% + 50% * cos(calc(var(--percentage) * 3.6deg))) calc(50% - 50% * sin(calc(var(--percentage) * 3.6deg)))
      );
      transform: rotate(calc(var(--start-angle) * 3.6deg));
      z-index: 2;
    }
    
    .pie-slice.concluida {
      background: #C3E6CB;
      clip-path: polygon(
        50% 50%,
        50% 0%,
        calc(50% + 50% * cos(calc(var(--percentage) * 3.6deg))) calc(50% - 50% * sin(calc(var(--percentage) * 3.6deg)))
      );
      transform: rotate(calc(var(--start-angle) * 3.6deg));
      z-index: 1;
    }
    
    .chart-legend {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
    }
    
    .legend-color.pendente {
      background: #FFE8A1;
    }
    
    .legend-color.em-andamento {
      background: #B8DAFF;
    }
    
    .legend-color.concluida {
      background: #C3E6CB;
    }
    
    .legend-label {
      font-size: 14px;
      color: #555;
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
    
    .btn-profile {
      background: linear-gradient(135deg, #90caf9 0%, #64b5f6 100%);
      color: #0d47a1;
      border: 1px solid rgba(13, 71, 161, 0.2);
    }
    
    .btn-profile:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }
    
    .btn-admin {
      background: linear-gradient(135deg, #ffb74d 0%, #ff9800 100%);
      color: #e65100;
      border: 1px solid rgba(230, 81, 0, 0.2);
    }
    
    .btn-admin:hover {
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
      
      .pie-chart-container {
        max-width: 300px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  username: string = '';
  isAdmin: boolean = false;
  taskStats = {
    pendentes: 0,
    emAndamento: 0,
    concluidas: 0
  };
  
  // Dados do gráfico removidos
  
  // Subscriptions para gerenciar as inscrições
  private pendingTasksSubscription: Subscription | null = null;
  private inProgressTasksSubscription: Subscription | null = null;
  private completedTasksSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService, 
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.username;
      this.isAdmin = user.role === 'admin';
      this.subscribeToTaskStats();
    }
  }
  
  ngOnDestroy(): void {
    // Cancelar todas as inscrições para evitar vazamentos de memória
    if (this.pendingTasksSubscription) {
      this.pendingTasksSubscription.unsubscribe();
    }
    if (this.inProgressTasksSubscription) {
      this.inProgressTasksSubscription.unsubscribe();
    }
    if (this.completedTasksSubscription) {
      this.completedTasksSubscription.unsubscribe();
    }
  }
  
  subscribeToTaskStats(): void {
    // Inscrever-se para receber atualizações das estatísticas de tarefas
    this.pendingTasksSubscription = this.taskService.pendingTasks$.subscribe(count => {
      this.taskStats.pendentes = count;
    });
    
    this.inProgressTasksSubscription = this.taskService.inProgressTasks$.subscribe(count => {
      this.taskStats.emAndamento = count;
    });
    
    this.completedTasksSubscription = this.taskService.completedTasks$.subscribe(count => {
      this.taskStats.concluidas = count;
    });
    
    // Atualizar as estatísticas
    this.taskService.refreshTaskStats();
  }
  
  // Método de atualização do gráfico removido

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}