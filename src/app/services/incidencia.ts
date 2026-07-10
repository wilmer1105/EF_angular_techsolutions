import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private apiUrl = 'http://localhost:8080/api/incidencias';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categorias`);
  }

  getPrioridades(): Observable<any> {
    return this.http.get(`${this.apiUrl}/prioridades`);
  }

  getEstados(): Observable<any> {
    return this.http.get(`${this.apiUrl}/estados`);
  }

  getIncidenciasByUsuario(idUsuario: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  crearIncidencia(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, datos);
  }
  getAllIncidencias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todas`);
  }

  getTecnicos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tecnicos`);
  }

  asignarTecnico(datosAsignacion: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/asignar`, datosAsignacion);
  }
  // Añadir dentro de la clase IncidenciaService:

  getAsignacionesPorTecnico(idTecnico: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tecnico/${idTecnico}/asignaciones`);
  }

  actualizarEstadoIncidencia(idIncidencia: number, idEstado: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idIncidencia}/estado`, { id_estado: idEstado });
  }
  actualizarPrioridadIncidencia(idIncidencia: number, idPrioridad: number): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${idIncidencia}/prioridad`, { id_prioridad: idPrioridad });
}
}