import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IncidenciaService } from '../services/incidencia';
import { ReporteService } from '../services/reporte.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
    private reporteService: ReporteService,
    private cdr: ChangeDetectorRef, private router: Router
  ) { }
  ngOnInit() {
    const tecnicoGuardado = localStorage.getItem('nombre_usuario_logueado');
    if (tecnicoGuardado) {
      this.nombreTecnico = tecnicoGuardado;
    }

    // Recuperamos el ID para las consultas correspondientes
    const idGuardado = localStorage.getItem('id_usuario');
    if (idGuardado) {
      this.idTecnicoActual = Number(idGuardado);
    }

    this.cargarAsignaciones();
  }
  // Asegúrate de inyectar 'private router: Router' en tu constructor
cerrarSesion() {
  localStorage.clear();
  this.router.navigate(['/login']);
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

  descargarMisAsignaciones(): void {
    if (!this.idTecnicoActual) return;

    this.reporteService.descargarPdfPorTecnico(this.idTecnicoActual).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Mis_Asignaciones_${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar el PDF de asignaciones:', err);
        alert('No se pudo generar el reporte en este momento.');
      }
    });
  }
}