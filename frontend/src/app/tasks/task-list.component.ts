import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  
  // Filtros
  statusFilter: string = 'todos';
  priorityFilter: string = 'todos';
  searchTerm: string = '';
  
  // Edição de data
  editingTaskId: number | null = null;
  
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
    // Define a ordenação padrão para status
    this.sortField = 'status';
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
        
        // Aplicar ordenação padrão por status e prioridade
        filtered.sort((a, b) => {
          // Ordem de status: pendente (0), em_andamento (1), concluida (2)
          const statusOrder = { 'pendente': 0, 'em_andamento': 1, 'concluida': 2 };
          // Ordem de prioridade: alta (0), media (1), baixa (2)
          const priorityOrder = { 'alta': 0, 'media': 1, 'baixa': 2 };
          
          // Se o campo de ordenação for diferente de status ou prioridade, use a ordenação personalizada
          if (this.sortField !== 'status' && this.sortField !== 'priority') {
            let comparison = 0;
            
            switch (this.sortField) {
              case 'title':
                comparison = a.title.localeCompare(b.title);
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
          }
          
          // Ordenação padrão: primeiro por status, depois por prioridade
          if (a.status !== b.status) {
            return statusOrder[a.status] - statusOrder[b.status];
          }
          
          // Se o status for igual, ordena por prioridade
          return priorityOrder[a.priority] - priorityOrder[b.priority];
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
    // Recarregar tarefas do servidor quando os filtros de status ou prioridade mudam
    if (this.statusFilter !== 'todos' || this.priorityFilter !== 'todos') {
      this.loadTasks();
      return;
    }
    
    // Começamos com todas as tarefas
    let filtered = [...this.tasks];
    
    // Aplicar filtro de status
    if (this.statusFilter !== 'todos') {
      filtered = filtered.filter(task => task.status === this.statusFilter);
    }
    
    // Aplicar filtro de prioridade
    if (this.priorityFilter !== 'todos') {
      filtered = filtered.filter(task => task.priority === this.priorityFilter);
    }
    
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
      // Ordem de status: pendente (0), em_andamento (1), concluida (2)
      const statusOrder = { 'pendente': 0, 'em_andamento': 1, 'concluida': 2 };
      // Ordem de prioridade: alta (0), media (1), baixa (2)
      const priorityOrder = { 'alta': 0, 'media': 1, 'baixa': 2 };
      
      // Se o campo de ordenação for diferente de status ou prioridade, use a ordenação personalizada
      if (this.sortField !== 'status' && this.sortField !== 'priority') {
        let comparison = 0;
        
        switch (this.sortField) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
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
      }
      
      // Ordenação padrão: primeiro por status, depois por prioridade
      if (a.status !== b.status) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      
      // Se o status for igual, ordena por prioridade
      return priorityOrder[a.priority] - priorityOrder[b.priority];
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
    
    // Recarregar a ordenação
    this.loadTasks();
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

  // Propriedades para controlar os dropdowns
  private closeDropdownTimeout: any;
  private clickListener: any;
  
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'alta': return 'priority-high';
      case 'media': return 'priority-medium';
      case 'baixa': return 'priority-low';
      default: return '';
    }
  }
  
  // Métodos para controlar os dropdowns
  openDropdown(event: MouseEvent, type: string): void {
    // Previne a propagação do evento para evitar que o dropdown feche imediatamente
    event.stopPropagation();
    
    // Cancela qualquer fechamento pendente
    this.cancelCloseDropdown();
    
    // Remove qualquer listener de clique anterior
    this.removeClickListener();
    
    // Fecha todos os outros dropdowns primeiro
    document.querySelectorAll('.dropdown-content.show').forEach(el => {
      if (!el.parentElement?.contains(event.target as Node)) {
        el.classList.remove('show');
        (el as HTMLElement).style.top = '';
        (el as HTMLElement).style.left = '';
      }
    });
    
    // Abre este dropdown
    const dropdown = (event.currentTarget as HTMLElement).querySelector('.dropdown-content');
    if (dropdown) {
      // Posiciona o dropdown próximo ao elemento clicado
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const dropdownEl = dropdown as HTMLElement;
      
      // Posiciona o dropdown acima do elemento
      dropdownEl.style.top = (rect.top - 120) + 'px'; // Altura suficiente para mostrar 3 itens
      dropdownEl.style.left = rect.left + 'px';
      
      dropdown.classList.add('show');
      
      // Adiciona um listener para fechar o dropdown quando clicar fora dele
      this.addClickListener();
    }
  }
  
  closeDropdownWithDelay(event: MouseEvent, type: string): void {
    // Configura um timeout para fechar o dropdown após um atraso
    this.closeDropdownTimeout = setTimeout(() => {
      const dropdown = (event.currentTarget as HTMLElement).querySelector('.dropdown-content');
      if (dropdown) {
        dropdown.classList.remove('show');
        (dropdown as HTMLElement).style.top = '';
        (dropdown as HTMLElement).style.left = '';
      }
    }, 300); // 300ms de atraso antes de fechar
  }
  
  cancelCloseDropdown(): void {
    // Cancela o timeout de fechamento se existir
    if (this.closeDropdownTimeout) {
      clearTimeout(this.closeDropdownTimeout);
      this.closeDropdownTimeout = null;
    }
  }
  
  // Adiciona um listener para fechar o dropdown quando clicar fora dele
  private addClickListener(): void {
    this.clickListener = (e: MouseEvent) => {
      // Verifica se o clique foi fora de qualquer dropdown
      const clickedOnDropdown = Array.from(document.querySelectorAll('.dropdown-content, .dropdown')).some(
        el => el.contains(e.target as Node)
      );
      
      if (!clickedOnDropdown) {
        this.closeAllDropdowns();
      }
    };
    
    // Adiciona o listener com um pequeno atraso para evitar que o evento atual o acione
    setTimeout(() => {
      document.addEventListener('click', this.clickListener);
    }, 100);
  }
  
  // Remove o listener de clique global
  private removeClickListener(): void {
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
      this.clickListener = null;
    }
  }
  
  // Fecha todos os dropdowns
  private closeAllDropdowns(): void {
    document.querySelectorAll('.dropdown-content.show').forEach(el => {
      el.classList.remove('show');
      (el as HTMLElement).style.top = '';
      (el as HTMLElement).style.left = '';
    });
    this.removeClickListener();
  }
  
  // Método para limpar recursos quando o componente é destruído
  // Métodos para edição de data
  openDatePicker(task: Task): void {
    this.editingTaskId = task.id || null;
    setTimeout(() => {
      const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
      if (dateInput) {
        dateInput.focus();
        dateInput.click();
      }
    }, 10);
  }
  
  updateTaskDate(task: Task, event: Event): void {
    const newDate = (event.target as HTMLInputElement).value;
    if (newDate) {
      this.taskService.updateTask(task.id!, { due_date: newDate }).subscribe({
        next: () => {
          task.due_date = newDate;
          this.editingTaskId = null;
          // Recarregar a página para garantir que as alterações sejam aplicadas
          window.location.reload();
        },
        error: (error) => {
          console.error('Erro ao atualizar data da tarefa:', error);
          alert('Não foi possível atualizar a data da tarefa. Por favor, tente novamente.');
          this.editingTaskId = null;
        }
      });
    } else {
      // Se a data for removida
      this.taskService.updateTask(task.id!, { due_date: null }).subscribe({
        next: () => {
          task.due_date = null;
          this.editingTaskId = null;
          // Recarregar a página para garantir que as alterações sejam aplicadas
          window.location.reload();
        },
        error: (error) => {
          console.error('Erro ao remover data da tarefa:', error);
          alert('Não foi possível remover a data da tarefa. Por favor, tente novamente.');
          this.editingTaskId = null;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.removeClickListener();
    if (this.closeDropdownTimeout) {
      clearTimeout(this.closeDropdownTimeout);
    }
  }
  
  updateTaskStatus(task: Task, newStatus: 'pendente' | 'em_andamento' | 'concluida'): void {
    if (task.status === newStatus) return;
    
    this.taskService.updateTask(task.id!, { status: newStatus }).subscribe({
      next: () => {
        task.status = newStatus;
        // Fecha o dropdown após a seleção
        this.closeAllDropdowns();
        // Recarregar a lista de tarefas do servidor
        window.location.reload();
      },
      error: (error) => {
        console.error('Erro ao atualizar status da tarefa:', error);
        alert('Não foi possível atualizar o status da tarefa. Por favor, tente novamente.');
      }
    });
  }
  
  updateTaskPriority(task: Task, newPriority: 'baixa' | 'media' | 'alta'): void {
    if (task.priority === newPriority) return;
    
    this.taskService.updateTask(task.id!, { priority: newPriority }).subscribe({
      next: () => {
        task.priority = newPriority;
        // Fecha o dropdown após a seleção
        this.closeAllDropdowns();
        // Recarregar a lista de tarefas do servidor
        window.location.reload();
      },
      error: (error) => {
        console.error('Erro ao atualizar prioridade da tarefa:', error);
        alert('Não foi possível atualizar a prioridade da tarefa. Por favor, tente novamente.');
      }
    });
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