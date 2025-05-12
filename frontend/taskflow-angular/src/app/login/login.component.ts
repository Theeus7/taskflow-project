import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

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
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido:', response);
          // Redirecionar para a página principal após o login
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erro no login:', error);
          this.errorMessage = error.error?.detail || 'Falha na autenticação. Verifique suas credenciais.';
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
