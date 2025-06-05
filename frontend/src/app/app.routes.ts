import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskListComponent } from './components/tasks/task-list.component';
import { TaskFormComponent } from './components/tasks/task-form/task-form.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { CreateAdminComponent } from './components/admin/create-admin.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',  // Rota principal ou home
    component: HomeComponent
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
    path: 'create-admin',  // Rota para criar administrador
    component: CreateAdminComponent
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
  },
  {
    path: 'profile',  // Rota para o perfil do usuário
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',  // Rota para o painel de administração
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard]
  }
];