import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IncidenciaService } from '../services/incidencia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReporteService } from '../services/reporte.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  vistaActiva: 'incidencias' | 'usuarios' | 'reportes' = 'incidencias';

  incidencias: any[] = [];
  tecnicos: any[] = [];
  categorias: any[] = [];
  prioridades: any[] = [];
  estados: any[] = [];
  usuarios: any[] = [];
  roles: any[] = [];

  nombreAdmin: string = 'Administrador';
  mensajeExito: string = '';
  mensajeUsuario: string = '';
  mensajeErrorUsuario: string = '';

  incidenciaSeleccionada: any = null;
  idTecnicoSeleccionado: number | null = null;
  observacionAsignacion: string = '';

  listaPrioridades = [
    { id: 1, nombre: 'Baja' },
    { id: 2, nombre: 'Media' },
    { id: 3, nombre: 'Alta' },
    { id: 4, nombre: 'Crítica' }
  ];

  nuevoUsuario = {
    nombres: '',
    apellidos: '',
    correoUsuario: '',
    password: '',
    telefono: '',
    idRol: null as number | null
  };

  filtros = {
    idEstado: null as number | null,
    idPrioridad: null as number | null,
    idCategoria: null as number | null,
    idTecnico: null as number | null,
    fechaDesde: '',
    fechaHasta: ''
  };

  constructor(
    private incidenciaService: IncidenciaService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private reporteService: ReporteService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(){
    const adminGuardado = localStorage.getItem('nombre_usuario_logueado');
    if (adminGuardado) {
      this.nombreAdmin = adminGuardado;
    }
    this.cargarDatos();
    this.cargarCombosFiltro();
  }

  cambiarVista(vista: 'incidencias' | 'usuarios' | 'reportes') {
    this.vistaActiva = vista;
    if (vista === 'usuarios' && this.usuarios.length === 0) {
      this.cargarUsuarios();
    }
  }

  cargarDatos() {
    this.incidenciaService.getAllIncidencias().subscribe({
      next: (data) => {
        this.incidencias = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar incidencias:', err)
    });

    this.incidenciaService.getTecnicos().subscribe({
      next: (data) => {
        this.tecnicos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar técnicos:', err)
    });
  }

  cargarCombosFiltro() {
    this.incidenciaService.getCategorias().subscribe({
      next: (data) => { this.categorias = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
    this.incidenciaService.getPrioridades().subscribe({
      next: (data) => { this.prioridades = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error al cargar prioridades:', err)
    });
    this.incidenciaService.getEstados().subscribe({
      next: (data) => { this.estados = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error al cargar estados:', err)
    });
    this.usuarioService.listarRoles().subscribe({
      next: (data) => { this.roles = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error al cargar roles:', err)
    });
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => { this.usuarios = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  crearUsuario() {
    this.mensajeErrorUsuario = '';
    this.mensajeUsuario = '';

    if (!this.nuevoUsuario.nombres || !this.nuevoUsuario.apellidos || !this.nuevoUsuario.correoUsuario ||
        !this.nuevoUsuario.password || !this.nuevoUsuario.idRol) {
      this.mensajeErrorUsuario = 'Completa todos los campos obligatorios.';
      return;
    }

    this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe({
      next: (res) => {
        this.mensajeUsuario = `¡Usuario ${res.correo} creado con éxito!`;
        this.nuevoUsuario = { nombres: '', apellidos: '', correoUsuario: '', password: '', telefono: '', idRol: null };
        this.cargarUsuarios();
        setTimeout(() => { this.mensajeUsuario = ''; this.cdr.detectChanges(); }, 4000);
      },
      error: (err) => {
        this.mensajeErrorUsuario = err.error?.mensaje || 'No se pudo crear el usuario.';
        this.cdr.detectChanges();
      }
    });
  }

  cambiarGravedad(idIncidencia: number, event: any) {
    const idPrioridad = Number(event.target.value);
    this.incidenciaService.actualizarPrioridadIncidencia(idIncidencia, idPrioridad).subscribe({
      next: (res) => {
        this.mensajeExito = '¡Gravedad de la incidencia actualizada correctamente!';
        this.cargarDatos();
        setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: (err) => console.error('Error al cambiar la prioridad', err)
    });
  }

  seleccionarIncidencia(incidencia: any) {
    this.incidenciaSeleccionada = incidencia;
    this.idTecnicoSeleccionado = null;
    this.observacionAsignacion = '';
    this.cdr.detectChanges();
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
        this.cargarDatos();
        setTimeout(() => { this.mensajeExito = ''; this.cdr.detectChanges(); }, 4000);
      },
      error: (err) => console.error('Error al asignar técnico', err)
    });
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  descargarReporteGeneral(): void {
    this.reporteService.descargarPdfGeneral().subscribe({
      next: (blob: Blob) => this.disparaDescarga(blob, `Reporte_General_${new Date().getTime()}.pdf`),
      error: (err) => {
        console.error('Error al descargar el PDF:', err);
        alert('No se pudo generar el reporte en este momento.');
      }
    });
  }

  descargarReporteFiltrado(): void {
    this.reporteService.descargarPdfFiltrado(this.filtros).subscribe({
      next: (blob: Blob) => this.disparaDescarga(blob, `Reporte_Rendimiento_${new Date().getTime()}.pdf`),
      error: (err) => {
        console.error('Error al descargar el PDF filtrado:', err);
        alert('No se pudo generar el reporte con los filtros seleccionados.');
      }
    });
  }

  limpiarFiltros(): void {
    this.filtros = { idEstado: null, idPrioridad: null, idCategoria: null, idTecnico: null, fechaDesde: '', fechaHasta: '' };
  }

  private disparaDescarga(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
