import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../services/task.service';
import Chart from 'chart.js/auto';

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

      <div class="chart-container">
        <h2>Distribuição de Tarefas</h2>
        <div class="chart-wrapper">
          <canvas #taskChart width="300" height="300"></canvas>
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

    h1, h2 {
      color: #333;
      margin-bottom: 10px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }

    h2 {
      font-size: 20px;
      margin-top: 20px;
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

    .chart-container {
      margin: 20px auto 30px;
      max-width: 400px;
      padding: 15px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .chart-wrapper {
      position: relative;
      width: 100%;
      height: 300px;
      display: flex;
      justify-content: center;
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
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('taskChart') private chartRef!: ElementRef;
  private chart: Chart | undefined;

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
    // Contador para controlar quando todas as chamadas foram concluídas
    let completedCalls = 0;

    // Carregar tarefas pendentes
    this.taskService.getTasks('pendente').subscribe(tasks => {
      this.taskStats.pendentes = tasks.length;
      completedCalls++;
      if (completedCalls === 3) this.updateChart();
    });

    // Carregar tarefas em andamento
    this.taskService.getTasks('em_andamento').subscribe(tasks => {
      this.taskStats.emAndamento = tasks.length;
      completedCalls++;
      if (completedCalls === 3) this.updateChart();
    });

    // Carregar tarefas concluídas
    this.taskService.getTasks('concluida').subscribe(tasks => {
      this.taskStats.concluidas = tasks.length;
      completedCalls++;
      if (completedCalls === 3) this.updateChart();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChart();
    }, 100);
  }

  createChart(): void {
    const canvas = this.chartRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calcular o total para verificar se há dados
    const total = this.taskStats.pendentes + this.taskStats.emAndamento + this.taskStats.concluidas;

    // Se não houver dados, adicionar valores fictícios para mostrar o gráfico
    const data = total > 0 ?
      [this.taskStats.pendentes, this.taskStats.emAndamento, this.taskStats.concluidas] :
      [1, 1, 1]; // Valores fictícios para visualização inicial

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Pendentes', 'Em Andamento', 'Concluídas'],
        datasets: [{
          data: data,
          backgroundColor: [
            '#FFE8A1', // Amarelo para pendentes
            '#B8DAFF', // Azul para em andamento
            '#C3E6CB'  // Verde para concluídas
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  updateChart(): void {
    if (!this.chart) {
      this.createChart();
      return;
    }

    const total = this.taskStats.pendentes + this.taskStats.emAndamento + this.taskStats.concluidas;
    if (total > 0) {
      this.chart.data.datasets[0].data = [
        this.taskStats.pendentes,
        this.taskStats.emAndamento,
        this.taskStats.concluidas
      ];
      this.chart.update();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
