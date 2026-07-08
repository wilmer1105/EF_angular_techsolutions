import { Component, OnInit } from '@angular/core';
import { IncidenciaService } from '../services/incidencia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empleado-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleado-dashboard.html',
  styleUrls: ['./empleado-dashboard.css']
})
export class EmpleadoDashboardComponent implements OnInit {
  idUsuarioActual!: number;

  // Datos del formulario
  nuevaIncidencia = {
    titulo: '',
    descripcion: '',
    id_categoria: null,
    id_prioridad: null,
    id_usuario: 0
  };

  categorias: any[] = [];
  prioridades: any[] = [];
  misIncidencias: any[] = [];
  mensajeConfirmacion: string = '';

  constructor(private incidenciaService: IncidenciaService) { }

  ngOnInit() {
    // Recuperar el ID del usuario logueado
    const id = localStorage.getItem('id_usuario');
    if (id) {
      this.idUsuarioActual = parseInt(id, 10);
      this.nuevaIncidencia.id_usuario = this.idUsuarioActual;
      this.cargarListasFormulario();
      this.cargarMisIncidencias();
    }
  }

  cargarListasFormulario() {
    this.incidenciaService.getCategorias().subscribe(data => this.categorias = data);
    this.incidenciaService.getPrioridades().subscribe(data => this.prioridades = data);
  }

  cargarMisIncidencias() {
    this.incidenciaService.getIncidenciasByUsuario(this.idUsuarioActual).subscribe(data => {
      this.misIncidencias = data; // Al actualizar esta variable, Angular refresca la tabla automáticamente
    });
  }

  // ... dentro de EmpleadoDashboardComponent ...

  registrarIncidencia() {
    this.incidenciaService.crearIncidencia(this.nuevaIncidencia).subscribe({
      next: (res) => {
        // 1. Mostrar mensaje de confirmación
        this.mensajeConfirmacion = '¡Incidencia registrada correctamente! Está a la espera de ser asignada.';

        // 2. Limpiar el formulario
        this.nuevaIncidencia = {
          titulo: '',
          descripcion: '',
          id_categoria: null,
          id_prioridad: null,
          id_usuario: this.idUsuarioActual // Mantenemos el ID del usuario
        };

        // 3. Actualizar la lista automáticamente sin recargar la página
        this.cargarMisIncidencias();

        // 4. Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
          this.mensajeConfirmacion = '';
        }, 5000);
      },
      error: (err) => {
        console.error('Error al registrar', err);
        alert('Hubo un error al registrar la incidencia.');
      }
    });
  }
}