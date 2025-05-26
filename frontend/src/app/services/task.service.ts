import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Task } from '../models/task.model';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8000/api/v1/tasks';
  private platformId = inject(PLATFORM_ID);
  
  // BehaviorSubjects para as estatísticas de tarefas
  private pendingTasksSubject = new BehaviorSubject<number>(0);
  private inProgressTasksSubject = new BehaviorSubject<number>(0);
  private completedTasksSubject = new BehaviorSubject<number>(0);
  
  // Observables públicos para os componentes se inscreverem
  public pendingTasks$ = this.pendingTasksSubject.asObservable();
  public inProgressTasks$ = this.inProgressTasksSubject.asObservable();
  public completedTasks$ = this.completedTasksSubject.asObservable();
  
  constructor(private http: HttpClient) {
    // Carregar estatísticas iniciais
    this.refreshTaskStats();
  }
  
  // Método para atualizar todas as estatísticas
  refreshTaskStats(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getTasks('pendente').subscribe(tasks => {
        this.pendingTasksSubject.next(tasks.length);
      });
      
      this.getTasks('em_andamento').subscribe(tasks => {
        this.inProgressTasksSubject.next(tasks.length);
      });
      
      this.getTasks('concluida').subscribe(tasks => {
        this.completedTasksSubject.next(tasks.length);
      });
    }
  }
  
  getTasks(
    status?: string,
    priority?: string,
    skip: number = 0,
    limit: number = 100
  ): Observable<Task[]> {
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());
      
    if (status) {
      params = params.set('status', status);
    }
    
    if (priority) {
      params = params.set('priority', priority);
    }
    
    // Obter o ID do usuário atual do localStorage
    if (isPlatformBrowser(this.platformId)) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userId = currentUser.id;
      
      if (userId) {
        params = params.set('user_id', userId.toString());
      }
    }
    
    return this.http.get<Task[]>(this.apiUrl, { params });
  }
  
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }
  
  createTask(task: Task): Observable<Task> {
    // Obter o ID do usuário atual do localStorage
    if (isPlatformBrowser(this.platformId)) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userId = currentUser.id;
      
      // Associar a tarefa ao usuário atual
      if (userId) {
        task.user_id = userId;
      }
    }
    
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(() => this.refreshTaskStats())
    );
  }
  
  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      tap(() => this.refreshTaskStats())
    );
  }
  
  deleteTask(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshTaskStats())
    );
  }
}