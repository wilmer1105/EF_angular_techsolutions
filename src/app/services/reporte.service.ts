import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private apiUrl = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient) { }

  // Método para descargar el PDF General
  descargarPdfGeneral(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/incidencias/pdf`, { responseType: 'blob' });
  }

  // Método para descargar el PDF filtrado por Estado
  descargarPdfPorEstado(idEstado: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/incidencias/estado/${idEstado}/pdf`, { responseType: 'blob' });
  }

  // Método para descargar el PDF de asignaciones de un Técnico
  descargarPdfPorTecnico(idTecnico: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/incidencias/tecnico/${idTecnico}/pdf`, { responseType: 'blob' });
  }

  // Método para descargar el PDF con filtros de rendimiento
  descargarPdfFiltrado(filtros: {
    idEstado?: number | null,
    idPrioridad?: number | null,
    idCategoria?: number | null,
    idTecnico?: number | null,
    fechaDesde?: string | null,
    fechaHasta?: string | null
  }): Observable<Blob> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value as string);
      }
    });
    return this.http.get(`${this.apiUrl}/incidencias/filtro/pdf`, { params, responseType: 'blob' });
  }
}