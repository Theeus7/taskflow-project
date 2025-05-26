import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <div class="logo-container">
        <!-- Espaço reservado para a logo -->
        <div class="logo-placeholder">
          <span>TaskFlow</span>
        </div>
      </div>
      
      <div class="welcome-section">
        <h1>Bem-vindo ao TaskFlow</h1>
        <p class="subtitle">Gerencie suas tarefas de forma simples e eficiente</p>
        
        <div class="features">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-tasks"></i>
            </div>
            <h3>Organize Tarefas</h3>
            <p>Crie e organize suas tarefas por status e prioridade</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <h3>Acompanhe Progresso</h3>
            <p>Visualize estatísticas e acompanhe seu desempenho</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-bell"></i>
            </div>
            <h3>Defina Prazos</h3>
            <p>Estabeleça datas limite e nunca perca um prazo</p>
          </div>
        </div>
      </div>
      
      <div class="cta-section">
        <button class="btn-primary" routerLink="/login">Entrar</button>
        <button class="btn-secondary" routerLink="/register">Criar Conta</button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Poppins', 'Roboto', 'Segoe UI', sans-serif;
      display: flex;
      flex-direction: column;
      min-height: 90vh;
    }
    
    .logo-container {
      display: flex;
      justify-content: center;
      margin-bottom: 40px;
      margin-top: 20px;
    }
    
    .logo-placeholder {
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-lg);
      color: var(--white);
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 1px;
      transition: var(--transition);
    }
    
    .logo-placeholder:hover {
      transform: scale(1.05);
      box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
    }
    
    .welcome-section {
      text-align: center;
      margin-bottom: 40px;
    }
    
    h1 {
      color: var(--accent-color);
      margin-bottom: 10px;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .subtitle {
      color: var(--primary-dark);
      margin-bottom: 40px;
      font-size: 18px;
      font-weight: 400;
    }
    
    .features {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 40px;
      flex-wrap: wrap;
    }
    
    .feature-card {
      background-color: var(--white);
      border-radius: var(--border-radius);
      padding: 30px;
      box-shadow: var(--shadow-md);
      transition: var(--transition);
      flex: 1;
      min-width: 250px;
      max-width: 350px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
    }
    
    .feature-icon {
      font-size: 36px;
      color: var(--primary-color);
      margin-bottom: 15px;
      background-color: var(--gray-light);
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    
    .feature-card h3 {
      color: var(--accent-color);
      margin-bottom: 10px;
      font-size: 20px;
      font-weight: 600;
    }
    
    .feature-card p {
      color: var(--text-color);
      font-size: 14px;
      line-height: 1.6;
    }
    
    .cta-section {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: auto;
      padding: 20px 0;
    }
    
    button {
      padding: 14px 30px;
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: var(--transition);
      box-shadow: var(--shadow-sm);
      letter-spacing: 0.3px;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: var(--white);
    }
    
    .btn-primary:hover {
      background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    .btn-secondary {
      background: linear-gradient(135deg, var(--secondary-color) 0%, var(--secondary-light) 100%);
      color: var(--accent-color);
    }
    
    .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    @media (max-width: 768px) {
      .features {
        flex-direction: column;
        align-items: center;
      }
      
      .feature-card {
        width: 100%;
        max-width: 100%;
      }
      
      .cta-section {
        flex-direction: column;
        align-items: center;
      }
      
      button {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class HomeComponent {}