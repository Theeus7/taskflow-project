import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
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
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          due_date: dueDate
        });
      },
      error: (error) => {
        console.error('Erro ao carregar tarefa:', error);
        this.errorMessage = 'Não foi possível carregar os dados da tarefa.';
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isSubmitting = true;
      
      const taskData: Task = {
        ...this.taskForm.value,
        // Garantir que a data seja enviada no formato correto ou null se vazia
        due_date: this.taskForm.value.due_date || null
      };
      
      const request = this.isEditMode && this.taskId
        ? this.taskService.updateTask(this.taskId, taskData)
        : this.taskService.createTask(taskData);
        
      request.subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Erro ao salvar tarefa:', error);
          this.errorMessage = 'Ocorreu um erro ao salvar a tarefa. Por favor, tente novamente.';
          this.isSubmitting = false;
        }
      });
    }
  }

  get title() { return this.taskForm.get('title'); }
  get description() { return this.taskForm.get('description'); }
  get status() { return this.taskForm.get('status'); }
  get priority() { return this.taskForm.get('priority'); }
  get due_date() { return this.taskForm.get('due_date'); }
}