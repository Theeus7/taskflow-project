import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { TaskManagementComponent } from './task-management/task-management.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, UserManagementComponent, TaskManagementComponent],
  template: `
    <div class="admin-container">
      <h1>Painel de Administração</h1>
      
      <div class="admin-tabs">
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'users'"
          (click)="setActiveTab('users')"
        >
          <i class="fas fa-users"></i> Usuários
        </button>
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'tasks'"
          (click)="setActiveTab('tasks')"
        >
          <i class="fas fa-tasks"></i> Tarefas
        </button>
      </div>
      
      <div class="tab-content">
        <app-user-management *ngIf="activeTab === 'users'"></app-user-management>
        <app-task-management *ngIf="activeTab === 'tasks'"></app-task-management>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Poppins', 'Roboto', 'Segoe UI', sans-serif;
    }
    
    h1 {
      color: #333;
      margin-bottom: 20px;
      text-align: center;
      font-weight: 600;
    }
    
    .admin-tabs {
      display: flex;
      margin-bottom: 20px;
      border-bottom: 1px solid #ddd;
    }
    
    .tab-button {
      padding: 12px 20px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      color: #666;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .tab-button:hover {
      color: #333;
    }
    
    .tab-button.active {
      color: #4a90e2;
      border-bottom-color: #4a90e2;
    }
    
    .tab-content {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class AdminComponent {
  activeTab: 'users' | 'tasks' = 'users';
  
  setActiveTab(tab: 'users' | 'tasks'): void {
    this.activeTab = tab;
  }
}