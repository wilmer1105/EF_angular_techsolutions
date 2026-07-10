import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    correo: string = '';
    password: string = '';
    mensajeError: string = '';

    constructor(private http: HttpClient, private router: Router) { }

    onLogin() {
        const credenciales = { correo: this.correo, password: this.password };

        this.http.post<any>('http://localhost:8080/api/auth/login', credenciales).subscribe({
            next: (response) => {
                // 1. Guardamos el ID del usuario
                localStorage.setItem('id_usuario', response.id_usuario.toString());

                // 2. Guardamos el Nombre Completo de manera genérica para usarlo en cualquier vista
                const nombreCompleto = `${response.nombres || ''} ${response.apellidos || ''}`.trim();
                localStorage.setItem('nombre_usuario_logueado', nombreCompleto || 'Usuario');

                // 3. Redirección según rol
                const idRol = response.id_rol;
                if (idRol === 1) {
                    this.router.navigate(['/admin']);
                } else if (idRol === 2) {
                    this.router.navigate(['/tecnico']);
                } else if (idRol === 3) {
                    this.router.navigate(['/empleado']);
                }
            },
            error: (err) => {
                this.mensajeError = 'Credenciales inválidas o error de conexión.';
            }
        });
    }
}