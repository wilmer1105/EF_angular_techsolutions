import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IncidenciaService } from '../services/incidencia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tecnico-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tecnico-dashboard.html',
  styleUrls: ['./tecnico-dashboard.css']
})
export class TecnicoDashboardComponent implements OnInit {
  asignaciones: any[] = [];
  mensajeExito: string = '';
  
  idTecnicoActual!: number; 
  nombreTecnico: string = 'Especialista';

  estadosDisponibles = [
    { id: 2, nombre: 'Asignada' },
    { id: 3, nombre: 'En Proceso' },
    { id: 4, nombre: 'Resuelta' }
  ];

  constructor(
    private incidenciaService: IncidenciaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Sincronización exacta con las llaves de tu localStorage
    const idGuardado = localStorage.getItem('id_usuario');
    const nombreGuardado = localStorage.getItem('nombre_tecnico');

    if (idGuardado) {
      this.idTecnicoActual = Number(idGuardado);
      this.nombreTecnico = nombreGuardado || 'Especialista';
    } else {
      console.warn('No se detectó una sesión activa de usuario técnico.');
    }

    this.cargarAsignaciones();
  }

  cargarAsignaciones() {
    if (!this.idTecnicoActual) return;

    this.incidenciaService.getAsignacionesPorTecnico(this.idTecnicoActual).subscribe({
      next: (data) => {
        this.asignaciones = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error al cargar las asignaciones del técnico:', err)
    });
  }

  cambiarEstado(idIncidencia: number, event: any) {
    const nuevoEstadoId = Number(event.target.value);
    
    this.incidenciaService.actualizarEstadoIncidencia(idIncidencia, nuevoEstadoId).subscribe({
      next: (res) => {
        this.mensajeExito = `¡El estado de la incidencia #${idIncidencia} se actualizó correctamente!`;
        this.cargarAsignaciones(); 
        
        setTimeout(() => {
          this.mensajeExito = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => console.error('Error al actualizar el estado:', err)
    });
  }
}