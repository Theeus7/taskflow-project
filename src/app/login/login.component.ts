import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login com:', email, password);

      // Aqui você pode chamar um serviço real de autenticação
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
