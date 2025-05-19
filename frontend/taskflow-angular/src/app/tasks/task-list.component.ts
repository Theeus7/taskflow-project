import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService, Task } from '../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  
  // Filtros
  statusFilter: string = 'todos';
  priorityFilter: string = 'todos';
  searchTerm: string = '';
  
  // Ordenação
  sortField: string = 'dueDate';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Paginação
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  
  // Estado da aplicação
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }
  
  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Registrar os valores dos filtros para debug
    console.log('Carregando tarefas com filtros:', {
      status: this.statusFilter !== 'todos' ? this.statusFilter : undefined,
      priority: this.priorityFilter !== 'todos' ? this.priorityFilter : undefined
    });
    
    this.taskService.getTasks(
      this.statusFilter !== 'todos' ? this.statusFilter : undefined,
      this.priorityFilter !== 'todos' ? this.priorityFilter : undefined
    ).subscribe({
      next: (tasks) => {
        console.log('Tarefas carregadas:', tasks);
        this.tasks = tasks;
        
        // Resetar a página atual para 1 quando os filtros mudam
        this.currentPage = 1;
        
        // Aplicar apenas ordenação e paginação, não filtros de servidor novamente
        let filtered = [...this.tasks];
        
        // Aplicar busca por termo
        if (this.searchTerm.trim() !== '') {
          const term = this.searchTerm.toLowerCase().trim();
          filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(term) || 
            (task.description && task.description.toLowerCase().includes(term))
          );
        }
        
        // Aplicar ordenação
        filtered.sort((a, b) => {
          let comparison = 0;
          
          switch (this.sortField) {
            case 'title':
              comparison = a.title.localeCompare(b.title);
              break;
            case 'priority':
              const priorityOrder = { 'alta': 0, 'media': 1, 'baixa': 2 };
              comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
              break;
            case 'status':
              const statusOrder = { 'pendente': 0, 'em_andamento': 1, 'concluida': 2 };
              comparison = statusOrder[a.status] - statusOrder[b.status];
              break;
            case 'dueDate':
              if (a.due_date && b.due_date) {
                comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
              } else if (a.due_date) {
                comparison = -1;
              } else if (b.due_date) {
                comparison = 1;
              }
              break;
          }
          
          return this.sortDirection === 'asc' ? comparison : -comparison;
        });
        
        // Calcular total de páginas
        this.totalPages = Math.ceil(filtered.length / this.pageSize);
        
        // Ajustar página atual se necessário
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1;
        }
        
        // Aplicar paginação
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.filteredTasks = filtered.slice(startIndex, startIndex + this.pageSize);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tarefas:', error);
        this.errorMessage = 'Não foi possível carregar as tarefas. Por favor, tente novamente.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    // Se os filtros de status ou prioridade mudaram, recarregar do servidor
    if (this.statusFilter !== 'todos' || this.priorityFilter !== 'todos') {
      this.loadTasks();
      return;
    }
    
    let filtered = [...this.tasks];
    
    // Aplicar busca por termo
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(term) || 
        (task.description && task.description.toLowerCase().includes(term))
      );
    }
    
    // Aplicar ordenação
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder = { 'alta': 0, 'media': 1, 'baixa': 2 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          const statusOrder = { 'pendente': 0, 'em_andamento': 1, 'concluida': 2 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'dueDate':
          if (a.due_date && b.due_date) {
            comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          } else if (a.due_date) {
            comparison = -1;
          } else if (b.due_date) {
            comparison = 1;
          }
          break;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    
    // Calcular total de páginas
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    
    // Ajustar página atual se necessário
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    
    // Aplicar paginação
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredTasks = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  changeSorting(field: string): void {
    if (this.sortField === field) {
      // Se já estiver ordenando por este campo, inverte a direção
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Caso contrário, ordena por este campo em ordem ascendente
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    this.applyFilters();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) {
      return 'fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  deleteTask(id: number | undefined): void {
    if (!id) {
      console.error('ID da tarefa não definido');
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Erro ao excluir tarefa:', error);
          alert('Não foi possível excluir a tarefa. Por favor, tente novamente.');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pendente': return 'status-pending';
      case 'em_andamento': return 'status-in-progress';
      case 'concluida': return 'status-completed';
      default: return '';
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

  getPages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // Se houver poucas páginas, mostra todas
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Caso contrário, mostra um subconjunto centrado na página atual
      let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
}