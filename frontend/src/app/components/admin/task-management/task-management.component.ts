import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import { Task } from '../../../models/task.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-panel">
      <h2>Gerenciamento de Tarefas</h2>
      
      <div class="filters">
        <div class="search-bar">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (input)="filterTasks()"
            placeholder="Buscar tarefas..." 
            class="search-input"
          >
          <button class="btn-add" (click)="openTaskModal()">
            <i class="fas fa-plus"></i> Nova Tarefa
          </button>
        </div>
        
        <div class="filter-controls">
          <div class="filter-group">
            <label for="status-filter">Status:</label>
            <select id="status-filter" [(ngModel)]="statusFilter" (change)="filterTasks()">
              <option value="todos">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="user-filter">Usuário:</label>
            <select id="user-filter" [(ngModel)]="userFilter" (change)="filterTasks()">
              <option value="todos">Todos</option>
              <option *ngFor="let user of users" [value]="user.id">{{ user.username }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="priority-filter">Prioridade:</label>
            <select id="priority-filter" [(ngModel)]="priorityFilter" (change)="filterTasks()">
              <option value="todos">Todas</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Usuário</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Data Limite</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let task of filteredTasks">
              <td>{{ task.id }}</td>
              <td class="title-cell">
                <div class="title-container">
                  <span>{{ task.title }}</span>
                  <small *ngIf="task.description">{{ task.description }}</small>
                </div>
              </td>
              <td>{{ getUserName(task.user_id || 0) }}</td>
              <td>
                <span class="status-badge" [ngClass]="getStatusClass(task.status)">
                  {{ getStatusLabel(task.status) }}
                </span>
              </td>
              <td>
                <span class="priority-badge" [ngClass]="getPriorityClass(task.priority)">
                  {{ getPriorityLabel(task.priority) }}
                </span>
              </td>
              <td>{{ task.due_date ? (task.due_date | date:'dd/MM/yyyy') : 'Sem data' }}</td>
              <td class="actions-cell">
                <button class="btn-action btn-edit" (click)="editTask(task)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" (click)="confirmDeleteTask(task)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredTasks.length === 0">
              <td colspan="7" class="no-data">
                <i class="fas fa-clipboard-list"></i>
                <p>Nenhuma tarefa encontrada</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Modal de Tarefa -->
      <div class="modal" *ngIf="showTaskModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ selectedTask.id ? 'Editar Tarefa' : 'Nova Tarefa' }}</h3>
            <button class="btn-close" (click)="closeTaskModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="title">Título</label>
              <input 
                type="text" 
                id="title" 
                [(ngModel)]="selectedTask.title" 
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label for="description">Descrição</label>
              <textarea 
                id="description" 
                [(ngModel)]="selectedTask.description" 
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="user_id">Usuário</label>
              <select id="user_id" [(ngModel)]="selectedTask.user_id" class="form-control">
                <option *ngFor="let user of users" [value]="user.id">{{ user.username }}</option>
              </select>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="status">Status</label>
                <select id="status" [(ngModel)]="selectedTask.status" class="form-control">
                  <option value="pendente">Pendente</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluida">Concluída</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="priority">Prioridade</label>
                <select id="priority" [(ngModel)]="selectedTask.priority" class="form-control">
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="due_date">Data Limite</label>
              <input 
                type="text" 
                id="due_date" 
                [(ngModel)]="selectedTask.due_date" 
                placeholder="DD/MM/AAAA"
                class="form-control"
              >
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="closeTaskModal()">Cancelar</button>
            <button class="btn-save" (click)="saveTask()">Salvar</button>
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
            <p>Tem certeza que deseja excluir a tarefa <strong>{{ taskToDelete?.title }}</strong>?</p>
            <p class="warning">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="closeConfirmModal()">Cancelar</button>
            <button class="btn-delete" (click)="deleteTask()">Excluir</button>
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
    
    .filters {
      margin-bottom: 20px;
    }
    
    .search-bar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
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
    
    .filter-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .filter-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .filter-group label {
      font-weight: 500;
      color: #555;
    }
    
    .filter-group select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .table-container {
      overflow-x: auto;
      margin-bottom: 20px;
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
    
    .title-cell {
      max-width: 250px;
    }
    
    .title-container {
      display: flex;
      flex-direction: column;
    }
    
    .title-container span {
      font-weight: 500;
    }
    
    .title-container small {
      color: #666;
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .status-in-progress {
      background-color: #cce5ff;
      color: #004085;
    }
    
    .status-completed {
      background-color: #d4edda;
      color: #155724;
    }
    
    .priority-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .priority-high {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .priority-medium {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .priority-low {
      background-color: #d1e7dd;
      color: #0f5132;
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
    
    .form-row {
      display: flex;
      gap: 15px;
    }
    
    .form-row .form-group {
      flex: 1;
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
    
    textarea.form-control {
      resize: vertical;
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
    
    @media (max-width: 768px) {
      .filter-controls {
        flex-direction: column;
      }
      
      .form-row {
        flex-direction: column;
      }
    }
  `]
})
export class TaskManagementComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  users: User[] = [];
  
  // Filtros
  searchTerm: string = '';
  statusFilter: string = 'todos';
  userFilter: string = 'todos';
  priorityFilter: string = 'todos';
  
  // Modal de tarefa
  showTaskModal: boolean = false;
  selectedTask: any = {};
  
  // Modal de confirmação
  showConfirmModal: boolean = false;
  taskToDelete: Task | null = null;
  
  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.loadUsers();
    this.loadTasks();
  }
  
  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    });
  }
  
  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filterTasks();
      },
      error: (error) => {
        console.error('Erro ao carregar tarefas:', error);
        alert('Não foi possível carregar a lista de tarefas.');
      }
    });
  }
  
  filterTasks(): void {
    let filtered = [...this.tasks];
    
    // Aplicar filtro de status
    if (this.statusFilter !== 'todos') {
      filtered = filtered.filter(task => task.status === this.statusFilter);
    }
    
    // Aplicar filtro de usuário
    if (this.userFilter !== 'todos') {
      const userId = parseInt(this.userFilter);
      filtered = filtered.filter(task => task.user_id === userId);
    }
    
    // Aplicar filtro de prioridade
    if (this.priorityFilter !== 'todos') {
      filtered = filtered.filter(task => task.priority === this.priorityFilter);
    }
    
    // Aplicar busca por termo
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(term) || 
        (task.description && task.description.toLowerCase().includes(term))
      );
    }
    
    this.filteredTasks = filtered;
  }
  
  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Usuário Desconhecido';
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'pendente': return 'status-pending';
      case 'em_andamento': return 'status-in-progress';
      case 'concluida': return 'status-completed';
      default: return '';
    }
  }
  
  getStatusLabel(status: string): string {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_andamento': return 'Em Andamento';
      case 'concluida': return 'Concluída';
      default: return status;
    }
  }
  
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'alta': return 'priority-high';
      case 'media': return 'priority-medium';
      case 'baixa': return 'priority-low';
      default: return '';
    }
  }
  
  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return priority;
    }
  }
  
  openTaskModal(task?: Task): void {
    if (task) {
      // Formatar a data para o formato DD/MM/AAAA
      let dueDate = '';
      if (task.due_date) {
        const date = new Date(task.due_date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        dueDate = `${day}/${month}/${year}`;
      }
      
      this.selectedTask = { 
        ...task,
        due_date: dueDate
      };
    } else {
      this.selectedTask = {
        title: '',
        description: '',
        status: 'pendente',
        priority: 'media',
        due_date: '',
        user_id: this.users.length > 0 ? this.users[0].id : null
      };
    }
    this.showTaskModal = true;
  }
  
  closeTaskModal(): void {
    this.showTaskModal = false;
    this.selectedTask = {};
  }
  
  saveTask(): void {
    if (!this.selectedTask.title) {
      alert('Título da tarefa é obrigatório.');
      return;
    }
    
    if (!this.selectedTask.user_id) {
      alert('Selecione um usuário para a tarefa.');
      return;
    }
    
    // Converter a data do formato brasileiro para o formato ISO
    let isoDate: string | undefined = undefined;
    if (this.selectedTask.due_date) {
      const [day, month, year] = this.selectedTask.due_date.split('/');
      isoDate = `${year}-${month}-${day}`;
    }
    
    const taskData = {
      ...this.selectedTask,
      due_date: isoDate
    };
    
    if (this.selectedTask.id) {
      // Atualizar tarefa existente
      this.taskService.updateTask(this.selectedTask.id, taskData).subscribe({
        next: (updatedTask) => {
          const index = this.tasks.findIndex(t => t.id === updatedTask.id);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
          this.filterTasks();
          this.closeTaskModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar tarefa:', error);
          alert('Não foi possível atualizar a tarefa. Por favor, tente novamente.');
        }
      });
    } else {
      // Criar nova tarefa
      this.taskService.createTask(taskData).subscribe({
        next: (newTask) => {
          this.tasks.push(newTask);
          this.filterTasks();
          this.closeTaskModal();
        },
        error: (error) => {
          console.error('Erro ao criar tarefa:', error);
          alert('Não foi possível criar a tarefa. Por favor, tente novamente.');
        }
      });
    }
  }
  
  editTask(task: Task): void {
    this.openTaskModal(task);
  }
  
  confirmDeleteTask(task: Task): void {
    this.taskToDelete = task;
    this.showConfirmModal = true;
  }
  
  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.taskToDelete = null;
  }
  
  deleteTask(): void {
    if (!this.taskToDelete || !this.taskToDelete.id) return;
    
    this.taskService.deleteTask(this.taskToDelete.id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== this.taskToDelete?.id);
        this.filterTasks();
        this.closeConfirmModal();
      },
      error: (error) => {
        console.error('Erro ao excluir tarefa:', error);
        alert('Não foi possível excluir a tarefa. Por favor, tente novamente.');
        this.closeConfirmModal();
      }
    });
  }
}