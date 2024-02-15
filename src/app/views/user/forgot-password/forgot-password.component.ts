import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '@services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  constructor(
    private fb: FormBuilder,
    private userSvc: UserService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>
  ) {}
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  forgotPassword() {
    if (this.form.valid) {
      this.userSvc.forgotPassword(this.form.value.email!).subscribe((res) => {
        Swal.fire({
          title: 'Email enviado',
          text: 'Si tu dirección de correo electrónico está registrada y activa en nuestro sistema, te enviaremos un enlace para restablecer tu contraseña muy pronto. ¡Estamos aquí para ayudarte!',
          icon: 'success',
        });
        this.dialogRef.close();
      });
    } else this.form.markAllAsTouched();
  }
}
