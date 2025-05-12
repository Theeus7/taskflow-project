import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';  // Certifique-se de ajustar o caminho conforme necessário

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
  // Outras rotas podem ser adicionadas aqui
];
