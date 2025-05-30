import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: '../../../templates/login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  styleUrls: ['../../../styles/login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido:', response);
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erro no login:', error);
          this.isLoading = false;
          if (typeof error.error === 'object' && error.error !== null) {
            this.errorMessage = error.error.detail || 'Erro de autenticação';
          } else {
            this.errorMessage = error.message || 'Falha na autenticação. Verifique suas credenciais.';
          }
        }
      });
    }
  }

  get emailInvalid() {
    const control = this.loginForm.get('email');
    return control?.invalid && control?.touched;
  }
  
  get passwordInvalid() {
    const control = this.loginForm.get('password');
    return control?.invalid && control?.touched;
  }
}