import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicNavbarComponent } from '../components/shared/public-navbar/public-navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PublicNavbarComponent],
  template: `
    <app-public-navbar></app-public-navbar>
    
    <div class="home-container">
      <div class="hero-section">
        <div class="welcome-section">
          <h1 class="main-title">Bem-vindo ao <span class="logo-text accent">TaskFlow</span></h1>
          <p class="subtitle">Gerencie suas tarefas de forma simples e eficiente</p>
        </div>
      </div>
      
      <div class="features-section">
        <h2>Recursos Principais</h2>
        <div class="features">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-tasks"></i>
            </div>
            <h3>Organize Tarefas</h3>
            <p>Crie e organize suas tarefas por status e prioridade para manter tudo sob controle.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <h3>Acompanhe Progresso</h3>
            <p>Visualize estatísticas e acompanhe seu desempenho.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-bell"></i>
            </div>
            <h3>Defina Prazos</h3>
            <p>Estabeleça datas limite e nunca perca um prazo importante novamente.</p>
          </div>
        </div>
      </div>
      
      <div class="demo-section">
        <h2>Como Funciona</h2>
        <div class="demo-steps">
          <div class="demo-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Crie sua conta</h3>
              <p>Registre-se gratuitamente e comece a organizar suas tarefas em segundos.</p>
            </div>
          </div>
          
          <div class="demo-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Adicione suas tarefas</h3>
              <p>Crie tarefas com título, descrição, prioridade e prazo de conclusão.</p>
            </div>
          </div>
          
          <div class="demo-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Acompanhe seu progresso</h3>
              <p>Visualize estatísticas e atualize o status das suas tarefas conforme avança.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="testimonials-section">
        <h2>O que nossos usuários dizem</h2>
        <div class="testimonials">
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"O TaskFlow revolucionou minha produtividade. Agora consigo organizar todas as minhas tarefas em um só lugar."</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">JD</div>
              <div class="author-info">
                <h4>João Dias</h4>
                <p>Desenvolvedor Web</p>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"Interface intuitiva e fácil de usar. Recomendo para qualquer pessoa que precisa organizar melhor seu tempo."</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">MS</div>
              <div class="author-info">
                <h4>Maria Silva</h4>
                <p>Designer Gráfica</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer class="home-footer">
        <p>&copy; 2025 TaskFlow. Todos os direitos reservados.</p>
        <p>Desenvolvido como projeto acadêmico para o Centro Universitário Braz Cubas.</p>
      </footer>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 90px 20px 20px 20px;
      font-family: var(--font-main);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .hero-section {
      text-align: center;
      margin-bottom: 60px;
    }
    
    .logo-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    
    .logo-placeholder {
      width: 150px;
      height: 150px;
      background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-lg);
      color: var(--white);
      font-size: 28px;
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
      margin-bottom: 30px;
    }
    
    .main-title {
      color: var(--accent-color);
      margin-bottom: 10px;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .accent {
      color: var(--primary-color);
    }
    
    .subtitle {
      color: var(--primary-dark);
      margin-bottom: 30px;
      font-size: 18px;
      font-weight: 400;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 30px;
      font-size: 28px;
      color: var(--accent-color);
    }
    
    .features-section {
      margin-bottom: 60px;
    }
    
    .features {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .feature-card {
      background-color: var(--white);
      border-radius: var(--border-radius);
      padding: 25px;
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
      font-size: 30px;
      color: var(--primary-color);
      margin-bottom: 15px;
      background-color: var(--gray-light);
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
    }
    
    .feature-card h3 {
      color: var(--accent-color);
      margin-bottom: 10px;
      font-size: 20px;
      font-weight: 600;
    }
    
    .feature-card p {
      color: var(--text-color);
      font-size: 15px;
      line-height: 1.5;
    }
    
    .demo-section {
      margin-bottom: 60px;
    }
    
    .demo-steps {
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .demo-step {
      display: flex;
      align-items: center;
      gap: 20px;
      background-color: var(--white);
      border-radius: var(--border-radius);
      padding: 20px;
      box-shadow: var(--shadow-md);
      transition: var(--transition);
    }
    
    .demo-step:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg);
    }
    
    .step-number {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 700;
      flex-shrink: 0;
    }
    
    .step-content {
      flex-grow: 1;
    }
    
    .step-content h3 {
      margin-bottom: 5px;
      font-size: 18px;
    }
    
    .step-content p {
      color: var(--text-color);
      font-size: 15px;
    }
    
    .testimonials-section {
      margin-bottom: 60px;
    }
    
    .testimonials {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .testimonial-card {
      background-color: var(--white);
      border-radius: var(--border-radius);
      padding: 25px;
      box-shadow: var(--shadow-md);
      transition: var(--transition);
      flex: 1;
      min-width: 280px;
      max-width: 500px;
    }
    
    .testimonial-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg);
    }
    
    .testimonial-content {
      margin-bottom: 20px;
      font-style: italic;
      color: var(--text-color);
      font-size: 15px;
      line-height: 1.6;
    }
    
    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--secondary-color) 0%, var(--secondary-light) 100%);
      color: var(--accent-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }
    
    .author-info h4 {
      margin: 0;
      font-size: 16px;
      color: var(--accent-color);
    }
    
    .author-info p {
      margin: 0;
      font-size: 14px;
      color: var(--text-color);
      opacity: 0.8;
    }
    
    .home-footer {
      margin-top: auto;
      text-align: center;
      padding: 20px 0;
      border-top: 1px solid var(--gray);
      color: var(--text-color);
      opacity: 0.8;
      font-size: 14px;
    }
    
    .home-footer p {
      margin: 5px 0;
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
      
      .testimonials {
        flex-direction: column;
        align-items: center;
      }
      
      .testimonial-card {
        width: 100%;
        max-width: 100%;
      }
      
      .demo-step {
        flex-direction: column;
        text-align: center;
      }
      
      .main-title {
        font-size: 28px;
      }
      
      h2 {
        font-size: 24px;
      }
    }
  `]
})
export class HomeComponent {}