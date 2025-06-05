import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="create-admin-container">
      <h1>Criar Usuário Administrador</h1>
      
      <form [formGroup]="adminForm" (ngSubmit)="onSubmit()" class="admin-form">
        <div class="form-group">
          <label for="username">Nome de Usuário</label>
          <input 
            type="text" 
            id="username" 
            formControlName="username" 
            class="form-control"
            [class.is-invalid]="username?.invalid && username?.touched"
          >
          <div class="invalid-feedback" *ngIf="username?.invalid && username?.touched">
            <span *ngIf="username?.errors?.['required']">Nome de usuário é obrigatório</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            formControlName="email" 
            class="form-control"
            [class.is-invalid]="email?.invalid && email?.touched"
          >
          <div class="invalid-feedback" *ngIf="email?.invalid && email?.touched">
            <span *ngIf="email?.errors?.['required']">Email é obrigatório</span>
            <span *ngIf="email?.errors?.['email']">Email inválido</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Senha</label>
          <input 
            type="password" 
            id="password" 
            formControlName="password" 
            class="form-control"
            [class.is-invalid]="password?.invalid && password?.touched"
          >
          <div class="invalid-feedback" *ngIf="password?.invalid && password?.touched">
            <span *ngIf="password?.errors?.['required']">Senha é obrigatória</span>
            <span *ngIf="password?.errors?.['minlength']">A senha deve ter pelo menos 6 caracteres</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha</label>
          <input 
            type="password" 
            id="confirmPassword" 
            formControlName="confirmPassword" 
            class="form-control"
            [class.is-invalid]="confirmPassword?.invalid && confirmPassword?.touched || passwordMismatch"
          >
          <div class="invalid-feedback" *ngIf="confirmPassword?.touched && passwordMismatch">
            As senhas não coincidem
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-save" [disabled]="adminForm.invalid || isSubmitting || passwordMismatch">
            <i class="fas fa-user-plus"></i> Criar Administrador
          </button>
          <button type="button" class="btn-cancel" routerLink="/login">
            <i class="fas fa-times"></i> Cancelar
          </button>
        </div>
        
        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <div class="alert alert-success" *ngIf="successMessage">
          {{ successMessage }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    .create-admin-container {
      max-width: 500px;
      margin: 40px auto;
      padding: 20px;
      font-family: 'Poppins', 'Roboto', 'Segoe UI', sans-serif;
    }
    
    h1 {
      color: #333;
      margin-bottom: 20px;
      text-align: center;
      font-weight: 600;
    }
    
    .admin-form {
      background: #fff;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #555;
    }
    
    .form-control {
      width: 100%;
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      transition: border-color 0.3s;
    }
    
    .form-control:focus {
      border-color: #4a90e2;
      outline: none;
      box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    }
    
    .form-control.is-invalid {
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      color: #dc3545;
      font-size: 14px;
      margin-top: 5px;
    }
    
    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }
    
    button {
      padding: 12px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s;
    }
    
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .btn-save {
      background-color: #4a90e2;
      color: white;
    }
    
    .btn-save:hover:not(:disabled) {
      background-color: #3a7bc8;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    .btn-cancel {
      background-color: #f5f5f5;
      color: #333;
    }
    
    .btn-cancel:hover {
      background-color: #e0e0e0;
    }
    
    .alert {
      padding: 12px 15px;
      border-radius: 4px;
      margin-top: 20px;
    }
    
    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    
    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
  `]
})
export class CreateAdminComponent {
  adminForm: FormGroup;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  passwordMismatch: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.adminForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
    
    // Adicionar validador personalizado para confirmar senha
    this.adminForm.get('confirmPassword')?.valueChanges.subscribe(value => {
      const password = this.adminForm.get('password')?.value;
      this.passwordMismatch = password !== value;
    });
  }
  
  onSubmit(): void {
    if (this.adminForm.invalid || this.passwordMismatch) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const adminData = {
      username: this.adminForm.value.username,
      email: this.adminForm.value.email,
      password: this.adminForm.value.password,
      role: 'admin'
    };
    
    this.authService.createAdmin(adminData).subscribe({
      next: () => {
        this.successMessage = 'Administrador criado com sucesso! Redirecionando para o login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Erro ao criar administrador:', error);
        this.errorMessage = 'Não foi possível criar o administrador. Por favor, tente novamente.';
        this.isSubmitting = false;
      }
    });
  }
  
  get username() { return this.adminForm.get('username'); }
  get email() { return this.adminForm.get('email'); }
  get password() { return this.adminForm.get('password'); }
  get confirmPassword() { return this.adminForm.get('confirmPassword'); }
}