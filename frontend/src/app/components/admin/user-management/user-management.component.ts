import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-panel">
      <h2>Gerenciamento de Usuários</h2>
      
      <div class="search-bar">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          (input)="filterUsers()"
          placeholder="Buscar usuários..." 
          class="search-input"
        >
        <button class="btn-add" (click)="openUserModal()">
          <i class="fas fa-plus"></i> Novo Usuário
        </button>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Função</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge" [class.admin-role]="user.role === 'admin'">
                  {{ user.role === 'admin' ? 'Administrador' : 'Usuário' }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn-action btn-edit" (click)="editUser(user)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" (click)="confirmDeleteUser(user)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredUsers.length === 0">
              <td colspan="5" class="no-data">
                <i class="fas fa-users-slash"></i>
                <p>Nenhum usuário encontrado</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Modal de Usuário -->
      <div class="modal" *ngIf="showUserModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ selectedUser.id ? 'Editar Usuário' : 'Novo Usuário' }}</h3>
            <button class="btn-close" (click)="closeUserModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="username">Nome de Usuário</label>
              <input 
                type="text" 
                id="username" 
                [(ngModel)]="selectedUser.username" 
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                [(ngModel)]="selectedUser.email" 
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label for="role">Função</label>
              <select id="role" [(ngModel)]="selectedUser.role" class="form-control">
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            
            <div class="form-group" *ngIf="!selectedUser.id">
              <label for="password">Senha</label>
              <input 
                type="password" 
                id="password" 
                [(ngModel)]="selectedUser.password" 
                class="form-control"
              >
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="closeUserModal()">Cancelar</button>
            <button class="btn-save" (click)="saveUser()">Salvar</button>
          </div>
        </div>
      </div>
      
      <!-- Modal de Confirmação -->
      <div class="modal" *ngIf="showConfirmModal">
        <div class="modal-content confirm-modal">
          <div class="modal-header">
            <h3>Confirmar Exclusão</h3>
            <button class="btn-close" (click)="closeConfirmModal()">×</button>
          </div>
          <div class="modal-body">
            <p>Tem certeza que deseja excluir o usuário <strong>{{ userToDelete?.username }}</strong>?</p>
            <p class="warning">Esta ação não pode ser desfeita e todas as tarefas associadas a este usuário serão excluídas.</p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="closeConfirmModal()">Cancelar</button>
            <button class="btn-delete" (click)="deleteUser()">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-panel {
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #333;
      font-weight: 600;
    }
    
    .search-bar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    
    .search-input {
      flex: 1;
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      margin-right: 10px;
    }
    
    .btn-add {
      padding: 10px 15px;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn-add:hover {
      background-color: #43a047;
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .data-table th,
    .data-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    .data-table th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #333;
    }
    
    .data-table tbody tr:hover {
      background-color: #f5f5f5;
    }
    
    .role-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      background-color: #e0e0e0;
      color: #333;
    }
    
    .role-badge.admin-role {
      background-color: #bbdefb;
      color: #0d47a1;
    }
    
    .actions-cell {
      white-space: nowrap;
    }
    
    .btn-action {
      padding: 6px 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 5px;
      transition: all 0.3s;
    }
    
    .btn-edit {
      background-color: #e3f2fd;
      color: #0d47a1;
    }
    
    .btn-edit:hover {
      background-color: #bbdefb;
    }
    
    .btn-delete {
      background-color: #ffebee;
      color: #b71c1c;
    }
    
    .btn-delete:hover {
      background-color: #ffcdd2;
    }
    
    .no-data {
      text-align: center;
      color: #666;
      padding: 20px;
    }
    
    .no-data i {
      font-size: 24px;
      margin-bottom: 10px;
      color: #999;
    }
    
    /* Modal Styles */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background-color: #fff;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .confirm-modal {
      max-width: 400px;
    }
    
    .modal-header {
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-header h3 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }
    
    .btn-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .modal-footer {
      padding: 15px 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #555;
    }
    
    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .btn-save,
    .btn-cancel {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    
    .btn-save {
      background-color: #4caf50;
      color: white;
    }
    
    .btn-save:hover {
      background-color: #43a047;
    }
    
    .btn-cancel {
      background-color: #f5f5f5;
      color: #333;
    }
    
    .btn-cancel:hover {
      background-color: #e0e0e0;
    }
    
    .warning {
      color: #b71c1c;
      font-size: 14px;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  
  // Modal de usuário
  showUserModal: boolean = false;
  selectedUser: any = {};
  
  // Modal de confirmação
  showConfirmModal: boolean = false;
  userToDelete: User | null = null;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filterUsers();
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        alert('Não foi possível carregar a lista de usuários.');
      }
    });
  }
  
  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    );
  }
  
  openUserModal(user?: User): void {
    if (user) {
      this.selectedUser = { ...user };
    } else {
      this.selectedUser = {
        username: '',
        email: '',
        role: 'user',
        password: ''
      };
    }
    this.showUserModal = true;
  }
  
  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = {};
  }
  
  saveUser(): void {
    if (!this.selectedUser.username || !this.selectedUser.email) {
      alert('Nome de usuário e email são obrigatórios.');
      return;
    }
    
    if (!this.selectedUser.id && !this.selectedUser.password) {
      alert('Senha é obrigatória para novos usuários.');
      return;
    }
    
    if (this.selectedUser.id) {
      // Atualizar usuário existente
      this.authService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.filterUsers();
          this.closeUserModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar usuário:', error);
          alert('Não foi possível atualizar o usuário. Por favor, tente novamente.');
        }
      });
    } else {
      // Criar novo usuário
      this.authService.createUser(this.selectedUser).subscribe({
        next: (newUser) => {
          this.users.push(newUser);
          this.filterUsers();
          this.closeUserModal();
        },
        error: (error) => {
          console.error('Erro ao criar usuário:', error);
          alert('Não foi possível criar o usuário. Por favor, tente novamente.');
        }
      });
    }
  }
  
  editUser(user: User): void {
    this.openUserModal(user);
  }
  
  confirmDeleteUser(user: User): void {
    this.userToDelete = user;
    this.showConfirmModal = true;
  }
  
  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.userToDelete = null;
  }
  
  deleteUser(): void {
    if (!this.userToDelete || !this.userToDelete.id) return;
    
    this.authService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== this.userToDelete?.id);
        this.filterUsers();
        this.closeConfirmModal();
      },
      error: (error) => {
        console.error('Erro ao excluir usuário:', error);
        alert('Não foi possível excluir o usuário. Por favor, tente novamente.');
        this.closeConfirmModal();
      }
    });
  }
}