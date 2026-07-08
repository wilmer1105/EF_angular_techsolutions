import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Importamos el detector de cambios
import { IncidenciaService } from '../services/incidencia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  incidencias: any[] = [];
  tecnicos: any[] = [];
  
  incidenciaSeleccionada: any = null;
  idTecnicoSeleccionado: number | null = null;
  observacionAsignacion: string = '';
  
  mensajeExito: string = '';

  // 2. Inyectamos 'cdr' en el constructor
  constructor(
    private incidenciaService: IncidenciaService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // Manejo estructurado con control de cambios para incidencias
    this.incidenciaService.getAllIncidencias().subscribe({
      next: (data) => {
        this.incidencias = data;
        this.cdr.detectChanges(); // <--- 3. Forzamos a Angular a pintar la tabla en F5
      },
      error: (err) => console.error('Error al cargar incidencias:', err)
    });

    // Manejo estructurado con control de cambios para técnicos
    this.incidenciaService.getTecnicos().subscribe({
      next: (data) => {
        this.tecnicos = data;
        this.cdr.detectChanges(); // <--- 4. Forzamos a Angular a pintar el combo de técnicos en F5
      },
      error: (err) => console.error('Error al cargar técnicos:', err)
    });
  }

  seleccionarIncidencia(incidencia: any) {
    this.incidenciaSeleccionada = incidencia;
    this.idTecnicoSeleccionado = null;
    this.observacionAsignacion = '';
    this.cdr.detectChanges(); // Asegura que se abra el panel lateral
  }

  guardarAsignacion() {
    if (!this.idTecnicoSeleccionado) {
      alert('Por favor, seleccione un técnico.');
      return;
    }

    const payload = {
      id_incidencia: this.incidenciaSeleccionada.id_incidencia,
      id_tecnico: Number(this.idTecnicoSeleccionado),
      observacion: this.observacionAsignacion
    };

    this.incidenciaService.asignarTecnico(payload).subscribe({
      next: (res) => {
        this.mensajeExito = `¡Incidencia #${payload.id_incidencia} asignada con éxito!`;
        this.incidenciaSeleccionada = null; 
        this.cargarDatos(); // Recarga y fuerza el rediseño de la tabla
        
        setTimeout(() => {
          this.mensajeExito = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => console.error('Error al asignar técnico', err)
    });
  }
}