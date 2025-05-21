import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: 'pendente' | 'em_andamento' | 'concluida';
  priority: 'baixa' | 'media' | 'alta';
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8000/api/v1/tasks';
  
  constructor(private http: HttpClient) { }
  
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
    
    // Obter o ID do usuário atual do AuthService
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.id;
    
    if (userId) {
      params = params.set('user_id', userId.toString());
    }
    
    console.log('Parâmetros da requisição:', params.toString());
    
    return this.http.get<Task[]>(this.apiUrl, { params });
  }
  
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }
  
  createTask(task: Task): Observable<Task> {
    // Obter o ID do usuário atual do AuthService
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.id;
    
    // Associar a tarefa ao usuário atual
    if (userId) {
      task.user_id = userId;
    }
    
    return this.http.post<Task>(this.apiUrl, task);
  }
  
  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }
  
  deleteTask(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}