import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      form.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      
      this.authService.register({ username, email, password }).subscribe({
        next: (response) => {
          console.log('Registro bem-sucedido:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erro no registro:', error);
          this.errorMessage = error.error?.detail || 'Falha no registro. Tente novamente.';
        }
      });
    }
  }

  get usernameInvalid() {
    const control = this.registerForm.get('username');
    return control?.invalid && control?.touched;
  }
  
  get emailInvalid() {
    const control = this.registerForm.get('email');
    return control?.invalid && control?.touched;
  }
  
  get passwordInvalid() {
    const control = this.registerForm.get('password');
    return control?.invalid && control?.touched;
  }
  
  get confirmPasswordInvalid() {
    const control = this.registerForm.get('confirmPassword');
    return (control?.invalid || this.registerForm.hasError('passwordMismatch')) && control?.touched;
  }
}