import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskListComponent } from './tasks/task-list.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',  // Rota principal ou home
    redirectTo: '/login',  // Redireciona para o LoginComponent
    pathMatch: 'full'
  },
  {
    path: 'login',  // A rota para o LoginComponent
    component: LoginComponent
  },
  {
    path: 'register',  // A rota para o RegisterComponent
    component: RegisterComponent
  },
  {
    path: 'dashboard',  // Rota protegida para o dashboard
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tasks',  // Rota para a listagem de tarefas
    component: TaskListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tasks/new',  // Rota para criar nova tarefa
    component: TaskFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tasks/edit/:id',  // Rota para editar tarefa existente
    component: TaskFormComponent,
    canActivate: [AuthGuard]
  }
];
