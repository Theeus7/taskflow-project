import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User, UserProfileUpdate } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="profile-container">
      <h1>Meu Perfil</h1>
      
      <div class="profile-image-container">
        <div class="profile-image" [style.backgroundImage]="profileImageUrl">
          <div class="image-upload-overlay" (click)="triggerFileInput()">
            <i class="fas fa-camera"></i>
            <span>Alterar foto</span>
          </div>
        </div>
        <input 
          type="file" 
          id="fileInput"
          #fileInput 
          style="display: none" 
          accept="image/*"
          (change)="onFileSelected($event)"
        >
      </div>
      
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
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
        
        <div class="password-section">
          <h3>Alterar Senha</h3>
          
          <div class="form-group">
            <label for="currentPassword">Senha Atual</label>
            <input 
              type="password" 
              id="currentPassword" 
              formControlName="currentPassword" 
              class="form-control"
              [class.is-invalid]="currentPassword?.invalid && currentPassword?.touched"
            >
          </div>
          
          <div class="form-group">
            <label for="newPassword">Nova Senha</label>
            <input 
              type="password" 
              id="newPassword" 
              formControlName="newPassword" 
              class="form-control"
              [class.is-invalid]="newPassword?.invalid && newPassword?.touched"
            >
            <div class="invalid-feedback" *ngIf="newPassword?.invalid && newPassword?.touched">
              <span *ngIf="newPassword?.errors?.['minlength']">A senha deve ter pelo menos 6 caracteres</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmar Nova Senha</label>
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
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-save" [disabled]="profileForm.invalid || isSubmitting">
            <i class="fas fa-save"></i> Salvar Alterações
          </button>
          <button type="button" class="btn-cancel" routerLink="/dashboard">
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
    .profile-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Poppins', 'Roboto', 'Segoe UI', sans-serif;
    }
    
    h1 {
      color: #333;
      margin-bottom: 20px;
      text-align: center;
      font-weight: 600;
    }
    
    .profile-image-container {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }
    
    .profile-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      background-color: #e0e0e0;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border: 3px solid #fff;
    }
    
    .image-upload-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 8px 0;
      text-align: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .profile-image:hover .image-upload-overlay {
      opacity: 1;
    }
    
    .profile-form {
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
    
    .password-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    
    .password-section h3 {
      font-size: 18px;
      margin-bottom: 15px;
      color: #333;
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
      background-color: #4caf50;
      color: white;
    }
    
    .btn-save:hover:not(:disabled) {
      background-color: #43a047;
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
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  passwordMismatch: boolean = false;
  selectedFile: File | null = null;
  profileImageUrl: string = 'url("assets/default-profile.png")';
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    });
  }
  
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Preencher o formulário com os dados do usuário atual
    this.profileForm.patchValue({
      username: this.currentUser.username,
      email: this.currentUser.email
    });
    
    // Definir a imagem de perfil se existir
    if (this.currentUser.profile_image) {
      this.profileImageUrl = `url("${this.currentUser.profile_image}")`;
    }
    
    // Adicionar validador personalizado para confirmar senha
    this.profileForm.get('confirmPassword')?.valueChanges.subscribe(value => {
      const newPassword = this.profileForm.get('newPassword')?.value;
      this.passwordMismatch = newPassword !== value && value !== '';
    });
  }
  
  triggerFileInput(): void {
    const fileInput = document.querySelector('#fileInput') as HTMLElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Exibir preview da imagem
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = `url("${e.target.result}")`;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  onSubmit(): void {
    if (this.profileForm.invalid || this.passwordMismatch) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const profileUpdate: UserProfileUpdate = {};
    
    // Incluir apenas os campos que foram alterados
    if (this.profileForm.value.username !== this.currentUser?.username) {
      profileUpdate.username = this.profileForm.value.username;
    }
    
    if (this.profileForm.value.email !== this.currentUser?.email) {
      profileUpdate.email = this.profileForm.value.email;
    }
    
    // Incluir senha apenas se foi preenchida
    if (this.profileForm.value.currentPassword && this.profileForm.value.newPassword) {
      profileUpdate.current_password = this.profileForm.value.currentPassword;
      profileUpdate.new_password = this.profileForm.value.newPassword;
    }
    
    // Processar a imagem se foi selecionada
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        profileUpdate.profile_image = e.target.result;
        this.updateProfile(profileUpdate);
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.updateProfile(profileUpdate);
    }
  }
  
  private updateProfile(profileUpdate: UserProfileUpdate): void {
    // Verificar se há algo para atualizar
    if (Object.keys(profileUpdate).length === 0) {
      this.successMessage = 'Nenhuma alteração foi feita.';
      this.isSubmitting = false;
      return;
    }
    
    this.authService.updateProfile(profileUpdate).subscribe({
      next: (updatedUser) => {
        this.successMessage = 'Perfil atualizado com sucesso!';
        this.isSubmitting = false;
        
        // Atualizar o usuário no localStorage
        if (this.currentUser) {
          this.currentUser = { ...this.currentUser, ...updatedUser };
          this.authService.updateCurrentUser(this.currentUser);
        }
      },
      error: (error) => {
        console.error('Erro ao atualizar perfil:', error);
        this.errorMessage = 'Não foi possível atualizar o perfil. Por favor, tente novamente.';
        this.isSubmitting = false;
      }
    });
  }
  
  get username() { return this.profileForm.get('username'); }
  get email() { return this.profileForm.get('email'); }
  get currentPassword() { return this.profileForm.get('currentPassword'); }
  get newPassword() { return this.profileForm.get('newPassword'); }
  get confirmPassword() { return this.profileForm.get('confirmPassword'); }
}