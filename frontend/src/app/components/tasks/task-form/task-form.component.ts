import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: '../../../templates/task-form.component.html',
  styleUrls: ['../../../styles/task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode: boolean = false;
  taskId: number | null = null;
  errorMessage: string = '';
  isSubmitting: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      status: ['pendente', Validators.required],
      priority: ['media', Validators.required],
      due_date: ['']
    });
  }
  
  ngOnInit(): void {
    // Verificar se estamos no modo de edição
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.loadTask(this.taskId);
      }
    });
  }
  
  loadTask(id: number): void {
    this.taskService.getTask(id).subscribe({
      next: (task) => {
        // Formatar a data para o formato YYYY-MM-DD para o input date
        const dueDate = task.due_date ? task.due_date.split('T')[0] : '';
        
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          due_date: dueDate
        });
      },
      error: (error) => {
        console.error('Erro ao carregar tarefa:', error);
        this.errorMessage = 'Não foi possível carregar a tarefa. Por favor, tente novamente.';
      }
    });
  }
  
  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isSubmitting = true;
      
      const task: Task = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        status: this.taskForm.value.status,
        priority: this.taskForm.value.priority,
        due_date: this.taskForm.value.due_date
      };
      
      if (this.isEditMode && this.taskId) {
        // Modo de edição
        this.taskService.updateTask(this.taskId, task).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            console.error('Erro ao atualizar tarefa:', error);
            this.errorMessage = 'Não foi possível atualizar a tarefa. Por favor, tente novamente.';
            this.isSubmitting = false;
          }
        });
      } else {
        // Modo de criação
        this.taskService.createTask(task).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            console.error('Erro ao criar tarefa:', error);
            this.errorMessage = 'Não foi possível criar a tarefa. Por favor, tente novamente.';
            this.isSubmitting = false;
          }
        });
      }
    }
  }
  
  // Getter para o campo title do formulário
  get title() {
    return this.taskForm.get('title');
  }
}