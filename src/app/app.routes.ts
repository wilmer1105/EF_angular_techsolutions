import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EmpleadoDashboardComponent } from './empleado-dashboard/empleado-dashboard';
import { AdminDashboardComponent } from './admin-deashboard/admin-dashboard';
import { TecnicoDashboardComponent } from './tecnico-dashboard/tecnico-dashboard';



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'empleado', component: EmpleadoDashboardComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'tecnico', component: TecnicoDashboardComponent },

];