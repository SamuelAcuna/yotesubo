import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard] },
  {
    path: 'restablecerpass',
    loadChildren: () => import('./pages/restablecerpass/restablecerpass.module').then( m => m.RestablecerpassPageModule)
  
  },
  {
    path: 'ingreso-codigo',
    loadChildren: () => import('./pages/ingreso-codigo/ingreso-codigo.module').then( m => m.IngresoCodigoPageModule)
  },
  {
    path: 'cambio-pass',
    loadChildren: () => import('./pages/cambio-pass/cambio-pass.module').then( m => m.CambioPassPageModule)
  },
  {
    path: 'vista-viajes',
    loadChildren: () => import('./pages/vista-viajes/vista-viajes.module').then( m => m.VistaViajesPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'vista-detalle-viaje/:id',
    loadChildren: () => import('./pages/vista-detalle-viaje/vista-detalle-viaje.module').then( m => m.VistaDetalleViajePageModule), canActivate: [AuthGuard]
  },
  
  {
    path: 'crearviaje',
    loadChildren: () => import('./pages/crearviaje/crearviaje.module').then( m => m.CrearviajePageModule), canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'crear-autp',
    loadChildren: () => import('./pages/crear-autp/crear-autp.module').then( m => m.CrearAutpPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'mis-viajes',
    loadChildren: () => import('./pages/mis-viajes/mis-viajes.module').then( m => m.MisViajesPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'detalleviaje-conductor',
    loadChildren: () => import('./pages/detalleviaje-conductor/detalleviaje-conductor.module').then( m => m.DetalleviajeConductorPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'registro-usuario',
    loadChildren: () => import('./pages/registro-usuario/registro-usuario.module').then( m => m.RegistroUsuarioPageModule)
  },
  {
    path: 'vistapasajero/:id',
    loadChildren: () => import('./pages/vistapasajero/vistapasajero.module').then( m => m.VistapasajeroPageModule)
  },
  {
    path: 'vistaconductor/:id',
    loadChildren: () => import('./pages/vistaconductor/vistaconductor.module').then( m => m.VistaconductorPageModule)
  },





];



@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
